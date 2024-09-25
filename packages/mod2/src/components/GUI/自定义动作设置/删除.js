import { Path } from "@mod-utils/path";
import { 动作数据管理 } from "../../保存数据/保存动作";
import { BaseSubscreen } from "../gui";
import { RDrawBackNextButton, RDrawButton, RMouseIn } from "../RDraw";

export class 自定义动作设置_删除 extends BaseSubscreen {
    constructor() {
        super();

        this.backNextButtonRect = { X: 900, Y: 325, W: 400, H: 64 };
        this.backNextButtonRectLeft = { X: 900, Y: 325, W: 200, H: 64 };
        this.backNextButtonRectRight = { X: 1100, Y: 325, W: 200, H: 64 };

        this.deleteOneButtonRect = { X: 1360, Y: 325, W: 100, H: 64 };

        this.deleteAllButtonRect = { X: 1600, Y: 720, W: 90, H: 90 };

        const acts = Object.keys(动作数据管理()?.data || {});
        this.actIndex = Math.max(acts.length - 1, 0);
    }
    run() {
        DrawImageResize(Path.resolve("image/白箭头右.png"), 270, 730, 90, 50);
        DrawText(`删除`, 220, 760, "White");

        DrawText(`删除已有动作:`, 1000, 260, "White");

        const acts = Object.keys(动作数据管理()?.data || {});

        const targetActText = acts.length > 0 ? `[${acts[this.actIndex]}]` : "没有了";
        const prevActText = acts.length > 0 ? `[${acts[(this.actIndex - 1) % acts.length]}]` : "没有了";
        const nextActText = acts.length > 0 ? `[${acts[(this.actIndex + 1) % acts.length]}]` : "没有了";

        RDrawBackNextButton(
            this.backNextButtonRect,
            targetActText,
            "White",
            "",
            () => prevActText,
            () => nextActText
        );
        RDrawButton(
            this.deleteOneButtonRect,
            "🚮",
            "White",
            "",
            acts.length > 0 ? `删除[${acts[this.actIndex]}]` : "",
            acts.length == 0
        );
        RDrawButton(this.deleteAllButtonRect, "♻", "red", "", "清空所有创建动作");
    }
    click() {
        if (RMouseIn(this.backNextButtonRect)) {
            const acts = Object.keys(动作数据管理()?.data || {});
            if (acts.length > 1) {
                if (RMouseIn(this.backNextButtonRectLeft))
                    this.actIndex = (this.actIndex - 1 + acts.length) % acts.length;
                else if (RMouseIn(this.backNextButtonRectRight)) this.actIndex = (this.actIndex + 1) % acts.length;
            } else {
                this.actIndex = 0;
            }
        }
        if (RMouseIn(this.deleteOneButtonRect)) {
            const targetAct = Object.keys(动作数据管理()?.data || {})[this.actIndex];
            if (targetAct) 动作数据管理()?.删除动作(targetAct);
        }
    }
}
