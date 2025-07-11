import { Size, _decorator, Component, Sprite, assetManager, SpriteFrame, resources, Texture2D, Asset } from 'cc';
import { ResourceUtil } from '../utils/ResourceUtil'; // 1. 导入你的 ResourceManager


const { ccclass, property } = _decorator;
/**
 * EnemyData.ts
 * 这是一个纯粹的数据类，不继承Component。
 * 它专门用来存储一个敌人的所有属性（数据）。
 */
export class EnemyData {
    // ---- 基础属性 ----
    public maxHp: number;
    public currentHp: number;

    // ---- 其他属性 ----
    public enemyName: string;
    public isBoss: boolean;

    public enemyId: number;// 内部编号

    /**
     * 构造函数，在创建实例时用于初始化数据
     * @param enemyId id值，从0开始
     * @param hp 初始血量
     * @param name 名字
     */
    constructor(enemyId: number, hp: number, name: string) {
        this.enemyId = enemyId;
        this.maxHp = hp;
        this.currentHp = hp;
        this.enemyName = name;
        this.isBoss = false; // 默认值
    }

    // 你也可以在这里添加一些只对数据进行操作的方法
    public isAlive(): boolean {
        return this.currentHp > 0;
    }
}