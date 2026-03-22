import {
  _decorator,
  Component,
  RigidBody2D,
  Vec2,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  UITransform,
  Sprite,
  UIOpacity,
} from "cc";
import { GameManager } from "./GameManager";

const { ccclass, property } = _decorator;

@ccclass("Ball")
export class Ball extends Component {
  @property speed: number = 10;

  private rb: RigidBody2D = null;
  private manager: GameManager = null;
  private isDead: boolean = false;

  start() {
    this.rb = this.getComponent(RigidBody2D);
    this.manager = this.node.scene.getComponentInChildren(GameManager);

    const collider = this.getComponent(Collider2D);
    collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  launch() {
    this.isDead = false;

    const dir = new Vec2(0.5, 1).normalize();
    this.rb.linearVelocity = dir.multiplyScalar(this.speed);
  }
  private fixVelocity() {
    const v = this.rb.linearVelocity.clone();

    const minY = 2;

    if (Math.abs(v.y) < minY) {
      v.y = v.y >= 0 ? minY : -minY;
    }

    v.normalize().multiplyScalar(this.speed);
    this.rb.linearVelocity = v;
  }

  onBeginContact(
    self: Collider2D,
    other: Collider2D,
    contact: IPhysics2DContact,
  ) {
    if (this.isDead) return;

    const name = other.node.name;

    const otherobj = other.node;

    if (name.includes("DeathZone")) {
      if (this.isDead) return;

      this.isDead = true;

      this.rb.linearVelocity = new Vec2(0, 0);
      this.rb.angularVelocity = 0;

      this.scheduleOnce(() => {
        this.node.active = false;
        this.manager.NewBall();
      }, 0);

      return;
    }

    if (name.includes("Brick")) {
      const match = name.match(/\d+$/);

      if (name == "Brick5") {
        const img = otherobj.getComponent(Sprite);
        const opac = otherobj.children[0].getComponent(UIOpacity);
        if (opac.opacity === 255) {
          img.spriteFrame =
            img.node.children[0].getComponent(Sprite).spriteFrame;
          opac.opacity = 254;
          return;
        } else if (opac.opacity == 254) {
          this.scheduleOnce(() => {
            other.node.destroy();
          }, 0);
        }
      } else if (name == "Brick6") {
        return;
      } else {
        this.scheduleOnce(() => {
          other.node.destroy();
        }, 0);
      }

      this.manager.Score(1);
      this.scheduleOnce(() => {
        other.node.destroy();
      }, 0);

      this.manager.CheckProgress();
    }

    if (name.includes("Paddle")) {
      if (!this.manager.isGameStart) return;

      const paddleX = other.node.worldPosition.x;
      const ballX = this.node.worldPosition.x;
      const width = other.node.getComponent(UITransform).width;

      const diff = (ballX - paddleX) / (width / 2);
      const angle = diff * 60 * (Math.PI / 180);

      const dir = new Vec2(Math.sin(angle), Math.cos(angle)).normalize();
      this.rb.linearVelocity = dir.multiplyScalar(this.speed);
    }

    this.scheduleOnce(() => {
      this.fixVelocity();
    }, 0);
  }
}
