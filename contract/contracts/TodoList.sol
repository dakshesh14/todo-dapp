// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
// FIXME: for funtions to return array we need to use experimentail ABIEncoderV2; find another way to return user's tasks
pragma experimental ABIEncoderV2;

contract TodoList {
    struct Task {
        uint256 id;
        string title;
        address owner; // i dont know if we should store user address or not but for testing/learning I think it's ok
        bool completed;
        bool deleted; // we can't delete a task in blockchain, so we just mark it as deleted
    }

    uint256 private taskCount = 0;

    Task[] private tasks;

    event TaskCreated(uint256 id, string content, bool completed);
    event TaskCompleted(uint256 id, bool completed);
    event TaskDeleted(uint256 id, bool deleted);

    function createTask(string memory title) public {
        taskCount++;
        tasks.push(Task(taskCount, title, msg.sender, false, false));
        emit TaskCreated(taskCount, title, false);
    }

    function toggleCompleted(uint256 _id) public {
        _id = _id - 1;
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }

    function deleteTask(uint256 _id) public {
        _id = _id - 1;
        Task memory _task = tasks[_id];
        _task.deleted = true;
        tasks[_id] = _task;
        emit TaskDeleted(_id, _task.deleted);
    }

    function getTasks() public view returns (Task[] memory) {
        uint256 result = 0;

        for (uint256 i = 0; i < tasks.length; i++) {
            if (!tasks[i].deleted && tasks[i].owner == msg.sender) {
                result++;
            }
        }
        Task[] memory resultTasks = new Task[](result);

        for (uint256 i = 0; i < tasks.length; i++) {
            if (!tasks[i].deleted && tasks[i].owner == msg.sender) {
                resultTasks[--result] = tasks[i];
            }
        }

        return resultTasks;
    }
}
