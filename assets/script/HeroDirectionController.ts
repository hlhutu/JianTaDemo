import { _decorator, Component, Sprite, SpriteFrame, Texture2D, Rect, Vec2, Size, input, Input, EventTouch, Vec3, UITransform } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('HeroDirectionController')
@requireComponent(Sprite)
export class HeroDirectionController extends Component {
    private heroSprite: Sprite = null;
    @property(Texture2D)
    spriteSheetTexture: Texture2D = null;
    @property
    rows: number = 4;
    @property
    cols: number = 4;

    @property
    speed: number = 200;

    private directionFrames: SpriteFrame[][];
    private frameWidth: number = 32;
    private frameHeight: number = 32;
    private picRow: number = 0; // 当前帧所在行，0=下 1=左 2=右 3=上
    private picCol: number = 0; // 当前帧所在列

    private targetPosition: Vec3 = null; // 触摸目标位置
    private isMoving: boolean = false; // 是否正在移动

    onLoad() {
        this.heroSprite = this.getComponent(Sprite);
        this.frameWidth = this.spriteSheetTexture.width / this.cols;
        this.frameHeight = this.spriteSheetTexture.height / this.rows;
        this.initDirectionFrames();

        // 注册触摸事件
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchStart, this); // 持续移动
    }

    private initDirectionFrames() {
        this.directionFrames = [];
        for (let row = 0; row < this.rows; row++) {
            const rowFrames = [];
            for (let col = 0; col < this.cols; col++) {
                const x = col * this.frameWidth;
                const y = row * this.frameHeight;
                const spriteFrame = new SpriteFrame();
                spriteFrame.texture = this.spriteSheetTexture;
                spriteFrame.rect = new Rect(x, y, this.frameWidth, this.frameHeight);
                spriteFrame.offset = new Vec2(0, 0);
                spriteFrame.originalSize = new Size(this.frameWidth, this.frameHeight);
                rowFrames.push(spriteFrame);
            }
            this.directionFrames.push(rowFrames);
        }
    }

    private onTouchStart(event: EventTouch) {
        // 获取触摸位置的世界坐标
        const touchPos = event.getUILocation();
        const uiTransform = this.node.parent.getComponent(UITransform);
        this.targetPosition = uiTransform.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
        this.isMoving = true;
    }

    switchInterval: number = 0.15; // 可以适当调快动画播放速度

    start() {
        this.schedule(this.breath, this.switchInterval);
    }

    setDirection(row: number) {
        this.picRow = row;
    }


    breath() {
        // 只有在移动时才播放动画
        if (!this.isMoving) {
            this.picCol = 0; // 停止时可以回到初始帧
        } else {
            this.picCol++;
            if (this.picCol >= this.cols) {
                this.picCol = 0;
            }
        }
        this.heroSprite.spriteFrame = this.directionFrames[this.picRow][this.picCol];
    }


    onDestroy() {
        this.unschedule(this.breath);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchStart, this);
    }

    update(deltaTime: number) {
        if (!this.isMoving || !this.targetPosition) {
            return;
        }

        // 1. 计算当前位置到目标位置的方向向量
        const currentPos = this.node.position;
        const moveDir = this.targetPosition.clone().subtract(currentPos);

        // 2. 如果距离很近，则停止移动
        if (moveDir.length() < 10) {
            this.isMoving = false;
            return;
        }

        // 3. 根据方向向量决定角色朝向
        this.updateDirection(moveDir);

        // 4. 归一化向量，并根据速度和时间计算位移
        moveDir.normalize();
        const displacement = moveDir.multiplyScalar(this.speed * deltaTime);

        // 5. 更新节点位置
        this.node.setPosition(currentPos.add(displacement));
    }

    private updateDirection(dir: Vec3) {
        // 通过向量的角度判断方向
        // Atan2返回的是弧度，转为角度便于判断
        const angle = Math.atan2(dir.y, dir.x) * 180 / Math.PI;

        if (angle >= -45 && angle < 45) {
            this.setDirection(2); // 右
        } else if (angle >= 45 && angle < 135) {
            this.setDirection(3); // 上
        } else if (angle >= 135 || angle < -135) {
            this.setDirection(1); // 左
        } else {
            this.setDirection(0); // 下
        }
    }
}