import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinChatroomComponent } from './join-chatroom.component';

describe('JoinChatroomComponent', () => {
  let component: JoinChatroomComponent;
  let fixture: ComponentFixture<JoinChatroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinChatroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinChatroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
