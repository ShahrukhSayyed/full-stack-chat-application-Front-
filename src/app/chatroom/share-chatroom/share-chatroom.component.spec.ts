import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareChatroomComponent } from './share-chatroom.component';

describe('ShareChatroomComponent', () => {
  let component: ShareChatroomComponent;
  let fixture: ComponentFixture<ShareChatroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareChatroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareChatroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
