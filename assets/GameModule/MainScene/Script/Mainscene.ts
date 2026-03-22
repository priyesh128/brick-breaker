import { _decorator, Button, Component, director, find, Node } from "cc";
import { GlobalData, tapEffect } from "../../Common/Scripts/GlobalData";
const { ccclass, property } = _decorator;

@ccclass("Mainscene")
export class Mainscene extends Component {
  @property(Node)
  title: Node = null;
  @property(Node)
  buttons: Node = null;
  @property(Node)
  levelSelection: Node = null;

  start() {}

  loadScene() {
    director.loadScene("Gameplay");
  }

  playBtnClick(event: Button) {
    let btn = event.target;

    tapEffect(btn);
    this.loadScene();
  }
  levelBtnClick(event: Button) {
    let btn = event.target;

    this.levelSelection.active = true;
    this.buttons.active = false;
    this.title.active = false;
  }
  closeBtnClick(event: Button) {
    let btn = event.target;

    this.levelSelection.active = false;
    this.buttons.active = true;
    this.title.active = true;
  }
  levelSelectionClick(event: Button) {
    let btn = event.target;

    tapEffect(btn);
    GlobalData.levelNo = parseInt(btn.name);
    this.loadScene();
  }
}
