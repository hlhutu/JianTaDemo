import { Size, _decorator, Component, Sprite, assetManager, SpriteFrame, resources, Texture2D, Asset } from 'cc';
import { ResourceUtil } from '../utils/ResourceUtil'; // 1. 导入你的 ResourceManager

const { ccclass, property } = _decorator;

export class HeroData {
    // ---- 基础属性 ----
    public maxHp: number;
    public currentHp: number;

    // ---- 其他属性 ----
    public enemyName: string;

    /**
     * 构造函数，在创建实例时用于初始化数据
     * @param enemyId id值，从0开始
     * @param hp 初始血量
     * @param name 名字
     */
    constructor(hp: number, name: string) {
        this.maxHp = hp;
        this.currentHp = hp;
        this.enemyName = name;
    }

    // 你也可以在这里添加一些只对数据进行操作的方法
    public isAlive(): boolean {
        return this.currentHp > 0;
    }
}