import { ResourceUtil } from './ResourceUtil'; // 1. 导入你的 ResourceManager
import { Sprite, SpriteFrame, Texture2D, Rect, Vec2, Size } from 'cc'
/**
资源库
 */

export class AssertsLib {
    // 单例模式
    private static _instance: AssertsLib = null;
    private constructor() { }
    public static get instance(): AssertsLib {
        if (this._instance === null) {
            this._instance = new AssertsLib();
        }
        return this._instance;
    }

    private frameWidth: number = 32;// 一个人物的宽高
    private frameHeight: number = 32;
    // 加载敌人图片
    public async loadEnemySpriteFrame(id:number): Promise<SpriteFrame> {
        return new Promise<SpriteFrame>((resolve, reject) => {
            // 加载原始素材
            ResourceUtil.instance.loadAsset("mota", "enemy").then(res => {
                // 定位到目标位置，根据id定位
                const x = 0 * this.frameWidth;
                const y = id * this.frameHeight;
                const spriteFrame = res;
                spriteFrame.rect = new Rect(x, y, this.frameWidth, this.frameHeight);
                spriteFrame.offset = new Vec2(0, 0);
                spriteFrame.originalSize = new Size(this.frameWidth, this.frameHeight);
                // 返回结果
                resolve(spriteFrame);
            }).catch(e => {
                reject(e);
            });
        })
    }
}