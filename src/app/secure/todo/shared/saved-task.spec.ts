import {SavedTask} from './saved-task';

describe('SavedTask', () => {
  it('should create a SavedTask using a SavedTask like object', () => {
    const savedTaskLike = {
      _id: 'dsafasdf',
      description: 'hello',
      complete: false
    } as SavedTask;

    const savedTask = new SavedTask(savedTaskLike);

    expect(savedTask).toEqual(savedTaskLike);
    expect(savedTask instanceof SavedTask);
  });
});
