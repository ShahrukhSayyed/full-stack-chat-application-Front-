import { ChatroomModule } from './chatroom.module';

describe('ChatroomModule', () => {
  let chatroomModule: ChatroomModule;

  beforeEach(() => {
    chatroomModule = new ChatroomModule();
  });

  it('should create an instance', () => {
    expect(chatroomModule).toBeTruthy();
  });
});
