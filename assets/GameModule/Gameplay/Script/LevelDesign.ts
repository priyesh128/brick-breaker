import {
  _decorator,
  Component,
  instantiate,
  Node,
  resources,
  JsonAsset,
} from "cc";
import { GlobalData } from "../../Common/Scripts/GlobalData";

const { ccclass, property } = _decorator;

@ccclass("LevelDesign")
export class LevelDesign extends Component {
  @property([Node]) normalBricks: Node[] = [];
  @property(Node) doubleHitBrick: Node = null;
  @property(Node) unbreakableBrick: Node = null;

  startx = -308.5;
  starty = 615;
  gapx = 103;
  gapy = 36;

  private levels: number[][][] = [];

  onLoad() {
    this.loadLevelsFromJson();
  }

  loadLevelsFromJson() {
    resources.load("levels", JsonAsset, (err, data) => {
      if (err) {
        console.error("Failed to load levels.json", err);
        return;
      }

      this.levels = data.json.levels;
      this.loadLevel(GlobalData.levelNo);
    });
  }

  loadNextLevel() {
    GlobalData.levelNo++;

    if (GlobalData.levelNo > this.levels.length) {
      GlobalData.levelNo = 1;
    }

    this.loadLevel(GlobalData.levelNo);
  }

  loadLevel(levelNo: number) {
    const layout = this.levels[levelNo - 1];
    if (!layout) return;

    this.generate(layout);
  }

  generate(layout: number[][]) {
    this.node.removeAllChildren();

    for (let r = 0; r < layout.length; r++) {
      for (let c = 0; c < layout[r].length; c++) {
        const code = layout[r][c];
        if (code === 0) continue;

        const template = this.getBrickTemplate(code);
        if (!template) continue;

        const brick = instantiate(template);
        brick.setPosition(
          this.startx + c * this.gapx,
          this.starty - r * this.gapy,
        );
        this.node.addChild(brick);
      }
    }
  }

  getBrickTemplate(code: number): Node | null {
    if (code === 5) return this.doubleHitBrick;
    if (code === 6) return this.unbreakableBrick;

    if (code >= 1 && code <= this.normalBricks.length) {
      return this.normalBricks[code - 1];
    }

    return null;
  }
}
