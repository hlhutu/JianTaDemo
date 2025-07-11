import { _decorator, Component, Sprite, SpriteFrame, Texture2D, Rect, Vec2, Size, input, Input, EventTouch, Vec3, UITransform } from 'cc';
import {EnemyData} from "db://assets/script/model/EnemyData";
import {AssertsLib} from "db://assets/script/utils/AssertsLib";
const { ccclass, property, requireComponent } = _decorator;

// 静态角色，不会动的角色
@ccclass('StaticCharacters')
@requireComponent(Sprite)
export class StaticCharacters extends Component {

    private e: EnemyData

    setEnemy(e:EnemyData) {
        this.e = e
        // 刷新图片到当前精灵
        AssertsLib.instance.loadEnemySpriteFrame(e.enemyId).then(r => {
            const currentSprite: Sprite = this.getComponent(Sprite);
            currentSprite.spriteFrame = r;
        })
    }

    start() {
    }

    update(deltaTime: number) {
    }
}