import { _decorator, Component, Sprite, Node, EventTouch, Vec3, UITransform } from 'cc';
import {EnemyData} from "db://assets/script/model/EnemyData";
import {AssertsLib} from "db://assets/script/utils/AssertsLib";
import {EnemyManager} from "db://assets/script/EnemyManager";
import {HeroData} from "db://assets/script/model/HeroData";
const { ccclass, property, requireComponent } = _decorator;

@ccclass('HeroController')
@requireComponent(Sprite)
export class HeroController extends Component {// 英雄控制脚本

    // 在编辑器中，将前排的3个位置节点拖到这里
    @property({ type: [EnemyManager], tooltip: "请选择EnemyManager" })
    enemyManager: EnemyManager = null;

    private hero: HeroData

    onLoad() {
        // 监听节点上的触摸结束事件（点击）
        this.node.on(Node.EventType.TOUCH_END, this.onSpriteClick, this);
        this.hero = new HeroData(100, "英雄")
        AssertsLib.instance.loadHeroSpriteFrame().then(r => {
            const currentSprite: Sprite = this.getComponent(Sprite);
            currentSprite.spriteFrame = r;
        }).catch(err => {
            console.error(err);
        })
    }

    private arr:string[] = ["Front0", "Front1", "Front2", "Back0", "Back1", "Back2", "Back3"];
    private i:number = 0;
    onSpriteClick(event: EventTouch) {
        this.enemyManager.damage(this.arr[this.i], 10)
        if(this.i++>=this.arr.length-1) {// 达到临界值，从0开始
            this.i=0
        }
    }
}