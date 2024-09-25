import { Path } from "@mod-utils/path";
import 保存动作, { 动作数据管理 } from "../../保存数据/保存动作";
import { BaseSubscreen } from "../gui";
import {
    getInputElementById,
    ElementInputShowOrCreate,
    ElementTextAreaShowOrCreate,
    移除清空输入框,
    ReqTextAreaElementById,
} from "../utils";
import { RElementPositionFixed, RDrawButton, RMouseIn, RDrawText, RDrawTextCentered } from "../RDraw";
import ActivityManager from "@mod-utils/ActivityManager";

export class 自定义动作设置_动作 extends BaseSubscreen {
    /**
     * @param {()=>(AssetGroup|undefined)} getTargetGroup
     */
    constructor(getTargetGroup) {
        super();

        /** @type {'自己'|'对方'|'任意'} */
        this.targetType = "自己";

        this.targetGroup = getTargetGroup;

        this.actNameId = "笨蛋Luzi_activityName";
        this.actNameRect = { X: 1100, Y: 50, W: 550, H: 60 };

        this.targetButtonRect = { X: 1100, Y: 125, W: 250, H: 60 };

        this.targetSelfTextAreaId = "笨蛋Luzi_targetSelfText";
        this.targetSelfTextAreaRect = { X: 900, Y: 370, W: 750, H: 250 };
        this.targetSelfActRefRect = { X: 1430, Y: 300, W: 60, H: 60 };
        this.targetSelfActedRefRect = { X: 1510, Y: 300, W: 60, H: 60 };
        this.targetSelfActOwnRect = { X: 1590, Y: 300, W: 60, H: 60 };

        this.targetTextAreaId = "笨蛋Luzi_targetText";
        this.targetTextAreaRect = { X: 900, Y: 700, W: 750, H: 250 };
        this.targetActRefRect = { X: 1430, Y: 630, W: 60, H: 60 };
        this.targetActedRefRect = { X: 1510, Y: 630, W: 60, H: 60 };
        this.targetActOwnRect = { X: 1590, Y: 630, W: 60, H: 60 };

        this.saveButtonRect = { X: 1700, Y: 890, W: 250, H: 60 };
        this.saveButtonHint = { X: 1825, Y: 830 };
    }

    /** @returns {{ ret: boolean, what:string}} */
    canSaveReport() {
        if (!this.targetGroup()?.Name) return { ret: false, what: "还没有选择身体区域" };
        const name = getInputElementById(this.actNameId)?.value;
        if (!name) return { ret: false, what: "还没有设置动作名字" };
        if (!动作数据管理()?.动作可用(name)) return { ret: false, what: "已经存在动作" };
        return { ret: true, what: "" };
    }

    run() {
        DrawImageResize(Path.resolve("image/白箭头右.png"), 270, 232, 90, 50);
        DrawText("动作", 220, 260, "White");

        RDrawText({ X: 900, Y: 80 }, "动作名称：", "White");
        ElementInputShowOrCreate(this.actNameId, "text", "", "20");
        RElementPositionFixed(this.actNameRect, this.actNameId);

        RDrawText({ X: 900, Y: 155 }, "动作目标:", "White");
        if (this.targetType === "任意") RDrawButton(this.targetButtonRect, "👈👉都行", "White", "");
        else if (this.targetType === "自己") RDrawButton(this.targetButtonRect, "👈自己", "White", "");
        else if (this.targetType === "对方") RDrawButton(this.targetButtonRect, "👉其他人", "White", "");

        RDrawText({ X: 900, Y: 230 }, "身体区域:", "White");
        RDrawText({ X: 1100, Y: 230 }, this.targetGroup()?.Description || "(未选择)", "White");

        RDrawText({ X: 900, Y: 350 }, "对自己使用的文本:", "White");
        ElementTextAreaShowOrCreate(this.targetSelfTextAreaId, 200);
        RElementPositionFixed(this.targetSelfTextAreaRect, this.targetSelfTextAreaId);
        const selfDisabled = this.targetType === "对方";
        ReqTextAreaElementById(this.targetSelfTextAreaId).then((i) => {
            i.disabled = selfDisabled;
            i.style.backgroundColor = selfDisabled ? "LightGray" : "White";
        });
        const targetSelfColor = selfDisabled ? "LightGray" : "White";
        RDrawButton(this.targetSelfActRefRect, "👈", targetSelfColor, "", "", selfDisabled);
        RDrawButton(this.targetSelfActedRefRect, "👉", targetSelfColor, "", "", selfDisabled);
        RDrawButton(this.targetSelfActOwnRect, "🚻", targetSelfColor, "", "", selfDisabled);

        RDrawText({ X: 900, Y: 650 }, "对别人使用动作的文本:", "White");
        ElementTextAreaShowOrCreate(this.targetTextAreaId, 200);
        RElementPositionFixed(this.targetTextAreaRect, this.targetTextAreaId);
        const targetDisabled = this.targetType === "自己";
        ReqTextAreaElementById(this.targetTextAreaId).then((i) => {
            i.disabled = targetDisabled;
            i.style.backgroundColor = targetDisabled ? "LightGray" : "White";
        });
        const targetColor = targetDisabled ? "LightGray" : "White";
        RDrawButton(this.targetActRefRect, "👈", targetColor, "", "", targetDisabled);
        RDrawButton(this.targetActedRefRect, "👉", targetColor, "", "", targetDisabled);
        RDrawButton(this.targetActOwnRect, "🚻", targetColor, "", "", targetDisabled);

        const { ret, what } = this.canSaveReport();
        if (ret) RDrawButton(this.saveButtonRect, "保存", "White", "");
        else {
            RDrawButton(this.saveButtonRect, "保存", "LightGray", "", "", true);
            if (RMouseIn(this.saveButtonRect)) {
                RDrawTextCentered(this.saveButtonHint, what, "White");
            }
        }
    }

    click() {
        if (RMouseIn(this.targetButtonRect)) {
            if (this.targetType === "自己") this.targetType = "对方";
            else if (this.targetType === "对方") this.targetType = "任意";
            else if (this.targetType === "任意") this.targetType = "自己";
            else this.targetType = "自己";
        }

        if (this.targetType !== "对方") {
            if (RMouseIn(this.targetSelfActRefRect)) {
                ReqTextAreaElementById(this.targetSelfTextAreaId).then((i) => (i.value += "SourceCharacter"));
            } else if (RMouseIn(this.targetSelfActedRefRect)) {
                ReqTextAreaElementById(this.targetSelfTextAreaId).then((i) => (i.value += "TargetCharacter"));
            } else if (RMouseIn(this.targetSelfActOwnRect)) {
                ReqTextAreaElementById(this.targetSelfTextAreaId).then((i) => (i.value += "PronounPossessive"));
            }
        }

        if (this.targetType !== "自己") {
            if (RMouseIn(this.targetActRefRect)) {
                ReqTextAreaElementById(this.targetTextAreaId).then((i) => (i.value += "SourceCharacter"));
            } else if (RMouseIn(this.targetActedRefRect)) {
                ReqTextAreaElementById(this.targetTextAreaId).then((i) => (i.value += "TargetCharacter"));
            } else if (RMouseIn(this.targetActOwnRect)) {
                ReqTextAreaElementById(this.targetTextAreaId).then((i) => (i.value += "PronounPossessive"));
            }
        }

        if (RMouseIn(this.saveButtonRect)) {
            const { ret, what } = this.canSaveReport();
            if (ret) {
                const act = {
                    Name: getInputElementById(this.actNameId)?.value || "",
                    Target: this.targetType !== "自己" ? this.targetGroup().Name : "",
                    TargetSelf: this.targetType !== "对方" ? this.targetGroup().Name : "",
                    Dialog: getInputElementById(this.targetTextAreaId)?.value || "",
                    DialogSelf: getInputElementById(this.targetSelfTextAreaId)?.value || "",
                };
                动作数据管理()?.增加动作(act);
                this.当前页面 = "动作";
            }
        }
    }

    unload() {
        移除清空输入框(this.actNameId);
        移除清空输入框(this.targetSelfTextAreaId);
        移除清空输入框(this.targetTextAreaId);
    }
}
