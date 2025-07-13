import { _decorator, Component, Sprite, Color, tween, UIOpacity } from 'cc';
const { ccclass } = _decorator;

@ccclass('FlashEffect')
export class FlashEffect extends Component {

    private _sprite: Sprite = null;
    private _initialColor: Color;

    onLoad() {
        // 获取节点自身的 Sprite 组件
        this._sprite = this.getComponent(Sprite);
        if (this._sprite) {
            // 保存初始颜色，如果你的Sprite本身就有颜色
            this._initialColor = this._sprite.color.clone();
        }
    }

    /**
     * 调用此函数，让Sprite闪烁一次红色
     */
    public playRedFlash() {
        if (!this._sprite) {
            console.warn('此节点上没有找到 Sprite 组件');
            return;
        }
        console.log("Red Flash");
        // 先停止可能正在进行的旧动画，防止冲突
        tween(this._sprite).stop();

        // 1. 瞬间变为红色
        this._sprite.color = Color.RED;

        // 2. 延迟0.1秒后，用0.2秒时间平滑恢复到初始颜色
        tween(this._sprite)
            .delay(0.1)
            .to(0.2, { color: this._initialColor })
            .start();
    }
}