import {TemporaryTask} from './temporary-task';

describe('TemporaryTask', () => {
  it('should create a TemporaryTask using a TemporaryTask like object', () => {
    const temporaryTaskLike = {
      tempId: 'dsafasdf',
      description: 'hello',
      complete: false
    } as TemporaryTask;

    const temporaryTask = new TemporaryTask(temporaryTaskLike);

    expect(temporaryTask).toEqual(temporaryTaskLike);
    expect(temporaryTask instanceof TemporaryTask);
  });
});
