import { Button, Node, tween, Tween, Vec3 } from "cc";

export class GlobalData {
  static levelNo: number = 1;
  static readonly MAX_LEVEL: number = 3;

  static nextLevel() {
    this.levelNo++;

    if (this.levelNo > this.MAX_LEVEL) {
      this.levelNo = 1;
    }
  }
}
export function setButtonEnable(node: Node, enable: boolean) {
  const btn = node.getComponent(Button);
  if (!btn) {
    return;
  }
  btn.interactable = enable;
}
export function tapEffect(node: Node) {
  if (Tween.getRunningCount(node) != 0) return;

  const nodeScale = node.scale.clone();
  const tapScale = new Vec3(nodeScale.x * 0.9, nodeScale.y * 0.9, nodeScale.z);

  tween(node)
    .to(0.3, { scale: tapScale })
    .to(0.3, { scale: nodeScale })
    .start();
}
