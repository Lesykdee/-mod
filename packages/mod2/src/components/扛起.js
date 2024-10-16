import ActivityManager from "@mod-utils/ActivityManager";
import ChatRoomOrder from "@mod-utils/ChatRoomOrder";
import ModManager from "@mod-utils/ModManager";

/** @type { ActivityManagerInterface.ICustomActivity} */
const activity = {
    activity: {
        Name: "扛起",
        Prerequisite: [
            (prereq, acting, acted, group) => {
                return (
                    InventoryIsItemInList(acted, "ItemDevices", ["BurlapSack"]) &&
                    InventoryIsItemInList(acting, "ItemTorso", ["缰绳_Luzi"])
                );
            },
        ],
        MaxProgress: 50,
        Target: ["ItemTorso"],
    },
    run: (player, sender, info) => {
        if (info.TargetCharacter === player.MemberNumber) {
            const SrcChara = ChatRoomCharacter.find((C) => C.MemberNumber === info.SourceCharacter);
            if (!SrcChara) return;
            ChatRoomOrder.setDrawOrder({
                nextCharacter: SrcChara.MemberNumber,
                associatedAsset: {
                    group: "ItemDevices",
                    asset: "BurlapSack",
                },
            });
            ChatRoomLeashPlayer = SrcChara.MemberNumber;
        } else if (info.SourceCharacter === player.MemberNumber) {
            const TgtChara = ChatRoomCharacter.find((C) => C.MemberNumber === info.TargetCharacter);
            if (!TgtChara) return;
            ChatRoomOrder.setDrawOrder({
                prevCharacter: TgtChara.MemberNumber,
                associatedAsset: {
                    group: "ItemTorso",
                    asset: "缰绳_Luzi",
                },
            });
            if (ChatRoomLeashList.indexOf(TgtChara.MemberNumber) < 0) ChatRoomLeashList.push(TgtChara.MemberNumber);
        }
    },
    useImage: ["ItemDevices", "BurlapSack"],
    label: {
        CN: "背起",
        EN: "Carry on the back",
        RU: "Нести на спине",
    },
    dialog: {
        CN: "SourceCharacter将TargetCharacter背了起来.",
        EN: "SourceCharacter carried TargetCharacter on the back.",
        RU: "SourceCharacter взял TargetCharacter себе на спину.",
    },
};

export default function () {
    ActivityManager.addCustomActivity(activity);
}
