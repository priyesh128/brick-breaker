import { _decorator, Component, director, Node, game } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PauseMenu")
export class PauseMenu extends Component {
  @property(Node)
  pausePopup: Node = null;

  pauseGame() {
    this.pausePopup.active = true;
    this.scheduleOnce(() => {
      director.pause();
    }, 0);
  }
  resumeGame() {
    director.resume();
    this.pausePopup.active = false;
  }
  homeButton() {
    director.resume();
    director.loadScene("MainScene");
  }
}
