import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAuthComponent } from './chat-auth.component';

describe('ChatAuthComponent', () => {
  let component: ChatAuthComponent;
  let fixture: ComponentFixture<ChatAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
