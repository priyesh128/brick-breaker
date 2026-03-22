import { _decorator, Component, director, Label } from "cc";
import { GlobalData } from "../../Common/Scripts/GlobalData";
import { NativeBridge } from "../../Common/Scripts/NativeBridge";

const { ccclass, property } = _decorator;

@ccclass("CompetePopup")
export class CompetePopup extends Component {
  @property(Label)
  scoreLabel: Label = null;
  playAgain() {
    director.loadScene("Gameplay");
  }

  nextLevel() {
    GlobalData.nextLevel();
    director.loadScene("Gameplay");
  }

  homeButton() {
    director.loadScene("MainScene");
  }

  submitScore() {
    if (!this.scoreLabel) return;

    const score = this.scoreLabel.string;

    NativeBridge.copyToClipboard(score);

    const clipboardText = NativeBridge.getClipboardText();

    NativeBridge.showToast("Score: " + clipboardText);
  }
}
