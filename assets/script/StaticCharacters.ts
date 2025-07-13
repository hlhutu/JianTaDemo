import { _decorator, Component, Sprite, Label } from 'cc';
import {EnemyData} from "db://assets/script/model/EnemyData";
import {AssertsLib} from "db://assets/script/utils/AssertsLib";
import {FlashEffect} from "db://assets/script/FlashEffect";
const { ccclass, property, requireComponent } = _decorator;

// 敌人的控制脚本
@ccclass('StaticCharacters')
@requireComponent(Sprite)
export class StaticCharacters extends Component {

    private e: EnemyData
    // 在属性检查器中关联血量 Label
    @property(Label)
    hpLabel: Label = null;

    setEnemy(e:EnemyData) {
        this.e = e
        // 刷新图片到当前精灵
        AssertsLib.instance.loadEnemySpriteFrame(e.enemyId).then(r => {
            const currentSprite: Sprite = this.getComponent(Sprite);
            currentSprite.spriteFrame = r;
        }).catch(err => {
            console.error(err);
        })
    }

    public damage(hp:number) {// 血量减少
        this.e.currentHp = this.e.currentHp - hp;
        // 获取并播放闪红效果
        const flashEffect = this.getComponent(FlashEffect);
        if (flashEffect) {
            flashEffect.playRedFlash();
        }else {
            console.error("FlashEffect not found");
        }
    }

    start() {
    }

    /**
     * 更新血量显示
     */
    updateHpLabel() {
        if (this.hpLabel) {
            this.hpLabel.string = `${this.e.currentHp}/${this.e.maxHp}`;
        }
    }

    update(deltaTime: number) {
        this.updateHpLabel()
    }
}