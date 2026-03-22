import {
  _decorator,
  Component,
  EventTouch,
  find,
  Label,
  Node,
  PhysicsSystem2D,
  RigidBody2D,
  UITransform,
  v3,
  Vec2,
  Vec3,
} from "cc";
import { Ball } from "./Ball";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property(Node) paddle: Node = null;
  @property(Node) ball: Node = null;
  @property(Label) scoreLabel: Label = null;
  @property(Node) container: Node = null;
  @property(Node) gameOverPopup: Node = null;
  @property(Node) completePopup: Node = null;
  @property(Node) lifeNode: Node = null;
  @property([Node]) lifeIcons: Node[] = [];

  isDragging: boolean = false;
  isGameStart: boolean = false;
  life = 2;
  isCompleted = false;

  clampX: number = 0;
  paddleStartPos: Vec3 = null;
  ballStartPos: Vec3 = null;

  start() {
    PhysicsSystem2D.instance.enable = true;
    this.paddleStartPos = this.paddle.position.clone();
    this.ballStartPos = this.ball.position.clone();

    const parentWidth = this.paddle.parent.getComponent(UITransform).width;
    const paddleWidth = this.paddle.getComponent(UITransform).width;
    this.clampX = (parentWidth - paddleWidth) / 2;

    this.touchOn();
  }

  TouchStart(event: EventTouch) {
    const touch = event.getUILocation();
    const pos = this.paddle.parent
      .getComponent(UITransform)
      .convertToNodeSpaceAR(v3(touch.x, touch.y, 0));
    const clamp = Math.min(Math.max(pos.x, -this.clampX), this.clampX);
    this.paddle.setPosition(v3(clamp, this.paddle.position.y, 0));
    if (!this.isGameStart) {
      this.ball.setPosition(clamp, this.ball.position.y);
    }
    this.isDragging = true;
  }
  TouchMove(event: EventTouch) {
    const touch = event.getUILocation();
    const pos = this.paddle.parent
      .getComponent(UITransform)
      .convertToNodeSpaceAR(v3(touch.x, touch.y, 0));
    const clamp = Math.min(Math.max(pos.x, -this.clampX), this.clampX);
    this.paddle.setPosition(v3(clamp, this.paddle.position.y, 0));
    if (!this.isGameStart) {
      this.ball.setPosition(clamp, this.ball.position.y);
    }
  }
  TouchEnd(event: EventTouch) {
    this.isDragging = false;
    if (!this.isGameStart) {
      this.isGameStart = true;
      this.ball.getComponent(Ball).launch();
    }
  }

  Score(scor: number) {
    const newScore = parseInt(this.scoreLabel.string) + scor;
    this.scoreLabel.string = newScore.toString();
    this.CheckProgress();
  }
  NewBall() {
    this.life--;
    if (this.life == -1) {
      this.touchOn(false);
      this.gameOverPopup.active = true;
      return;
    }
    this.isGameStart = false;
    this.lifeIcons[this.life].active = false;

    this.ball.active = true;

    const ballRb = this.ball.getComponent(RigidBody2D);
    ballRb.linearVelocity = new Vec2(0, 0);

    this.ball.setPosition(this.paddle.position.x, this.ballStartPos.y, 0);
  }
  CheckProgress() {
    let count = 0;

    this.container.children.forEach((i) => {
      if (i.name == "Brick6") count++;
    });

    const remaining = this.container.children.length - count;

    console.log(this.container.children.length, count, remaining);

    if (this.container.children.length == 1 || remaining == 1) {
      this.touchOn(false);
      this.isCompleted = true;
      this.completePopup.active = true;
      this.isGameStart = false;

      const ballRb = this.ball.getComponent(RigidBody2D);
      ballRb.linearVelocity = new Vec2(0, 0);

      this.ball.setPosition(this.paddle.position.x, this.ballStartPos.y, 0);
    }
  }

  onBallMissed() {
    if (!this.isGameStart) return;

    this.isGameStart = false;

    const rb = this.ball.getComponent(RigidBody2D);
    rb.linearVelocity = new Vec2(0, 0);

    this.NewBall();
  }

  touchOn(isOn: boolean = true) {
    if (isOn) {
      this.node.on(Node.EventType.TOUCH_START, this.TouchStart, this);
      this.node.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
      this.node.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
    } else {
      this.node.off(Node.EventType.TOUCH_START, this.TouchStart, this);
      this.node.off(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
      this.node.off(Node.EventType.TOUCH_END, this.TouchEnd, this);
    }
  }
}
