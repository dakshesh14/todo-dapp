import React, { useEffect, useMemo, useState } from "react";
// next
import type { NextPage } from "next";
// react hook form
import { useForm } from "react-hook-form";
// ethers
import { ethers } from "ethers";
// contract related
import TaskAbi from "../../contract/build/contracts/TodoList.json";

const contractAddress = TaskAbi.networks["5777"].address;

// types
type Task = {
  id: number;
  title: string;
  completed: boolean;
  deleted: boolean;
};

const connectToWallet = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const accounts = await provider.listAccounts();
    return accounts;
  } catch (error) {
    alert("There was some error");
    console.error(error);
  }
};

const defaultValues: Partial<Task> = {
  title: "",
};

const Home: NextPage = () => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  const contract = useMemo(
    () => new ethers.Contract(contractAddress, TaskAbi.abi, signer),
    [signer]
  );

  const [currentAccount, setCurrentAccount] = useState<string | undefined>(
    () => {
      if (typeof window !== "undefined") {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        provider.listAccounts().then((accounts) => {
          setCurrentAccount(accounts[0]);
        });
      }
      return undefined;
    }
  );

  const [tasks, setTasks] = useState<Task[] | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Task>({
    defaultValues,
  });

  const onSubmit = async (formData: Task) => {
    try {
      const tx = await contract.createTask(formData.title);
      await tx.wait();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleComplete = async (id: number) => {
    try {
      const tx = await contract.toggleCompleted(id);
      await tx.wait();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const tx = await contract.deleteTask(id);
      await tx.wait();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!currentAccount) return;
    const getTasks = async () => {
      const tasks = await contract.getTasks();
      setTasks(
        tasks.map((task: any) => ({
          id: task.id.toNumber(),
          title: task.title,
          completed: task.completed,
          deleted: task.deleted,
        }))
      );
    };

    getTasks();
  }, [currentAccount, contract]);

  useEffect(() => {
    (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
      setCurrentAccount(accounts[0]);
    });
  }, []);

  useEffect(() => {
    (window as any).ethereum.on("TaskCreated", (task: any) => {
      setTasks((prev) => [
        ...(prev ?? []),
        {
          id: task.id.toNumber(),
          title: task.title,
          completed: task.completed,
          deleted: task.deleted,
        },
      ]);
    });

    (window as any).ethereum.on("TaskCompleted", (task: any) => {
      setTasks((prev) =>
        prev?.map((t) =>
          t.id === task.id.toNumber() ? { ...t, completed: task.completed } : t
        )
      );
    });

    (window as any).ethereum.on("TaskDeleted", (task: any) => {
      setTasks((prev) => prev?.filter((t) => t.id !== task.id.toNumber()));
    });

    return () => {
      (window as any).ethereum.removeAllListeners("TaskCreated");
      (window as any).ethereum.removeAllListeners("TaskCompleted");
      (window as any).ethereum.removeAllListeners("TaskDeleted");
    };
  }, []);

  if (!currentAccount) {
    return (
      <div className="h-full w-full p-4 md:p-20 flex justify-center items-center">
        <button
          type="button"
          className="p-2 rounded transition-colors duration-200 bg-black text-white hover:bg-white hover:text-black border-black border-2"
          onClick={() => {
            connectToWallet().then((accounts) => {
              console.log(accounts);
              setCurrentAccount(accounts?.[0]);
            });
          }}
        >
          Connect to Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full items-center justify-center bg-teal-lightest font-sans flex flex-col">
      <div className="mb-4 w-full">
        <h1 className="text-grey-darkest">Todo List</h1>
        <form className="flex mt-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker outline-none ${
              errors.title ? "border-red-500 bg-red-50" : ""
            }`}
            placeholder="Add Todo"
            {...register("title", { required: "Title is required." })}
          />
          <button
            type="submit"
            className="flex-no-shrink p-2 rounded transition-colors duration-200 bg-black text-white hover:bg-white hover:text-black border-black border-2"
          >
            Add
          </button>
        </form>
      </div>
      <div className="overflow-auto pr-4 w-full min-h-full max-h-full">
        {tasks ? (
          tasks.length > 0 ? (
            tasks.map(({ id, title, completed }) => (
              <div className="flex mb-4 items-center" key={id}>
                <p
                  className={`w-full text-grey-darkest ${
                    completed ? "line-through" : ""
                  }`}
                >
                  {title}
                </p>
                <button
                  className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded bg-green-500 text-white border-green-500 hover:text-green-500 hover:bg-white"
                  onClick={() => handleComplete(id)}
                >
                  {completed ? "Undo" : "Complete"}
                </button>
                <button
                  className="flex-no-shrink p-2 ml-2 border-2 rounded bg-red-500 text-white border-red-500 hover:text-red-500 hover:bg-white"
                  onClick={() => handleDelete(id)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-center">
              No tasks yet. Add a task by clicking the {`"Add"`} button.
            </p>
          )
        ) : (
          <div className="flex mb-4 w-full justify-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
