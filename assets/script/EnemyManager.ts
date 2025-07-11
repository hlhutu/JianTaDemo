import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { StaticCharacters } from './StaticCharacters'; // 确保导入你的静态角色脚本
import { Skull1 } from './model/Skull1'; // 骷髅

const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property(Prefab)
    enemyPrefab: Prefab = null;

    // --- 新增属性 ---
    // 在编辑器中，将前排的3个位置节点拖到这里
    @property({ type: [Node], tooltip: "前排3个位置节点" })
    frontRowPositions: Node[] = [];

    // 在编辑器中，将后排的4个位置节点拖到这里
    @property({ type: [Node], tooltip: "后排4个位置节点" })
    backRowPositions: Node[] = [];

    // --- 改变的逻辑 ---

    onLoad() {
        // 清理一下所有位置，防止编辑器里残留了测试节点
        this.clearAllEnemies();
    }

    start() {
        // --- 示例：生成5个敌人，让他们自动填满位置 ---
        for (let i = 0; i < 7; i++) {
            this.spawnEnemy(i);
        }
    }

    /**
     * 生成一个敌人，并自动放置到第一个可用的空位上
     * @param id 血量
     */
    public spawnEnemy(id: number) {
        // 1. 找到一个可用的位置节点
        const availablePositionNode = this.findAvailablePosition();

        if (!availablePositionNode) {
            console.warn("没有可用的敌人位置了！");
            return;
        }

        // 2. 实例化敌人
        const enemyNode = instantiate(this.enemyPrefab);

        // 3. 将敌人节点添加到“位置标记节点”下
        // 这是一种很巧妙的方法，让敌人的坐标系和位置标记绑定
        availablePositionNode.addChild(enemyNode);
        // 把敌人在其父节点（位置标记节点）中的位置设置为原点
        enemyNode.setPosition(Vec3.ZERO);

        // 4. 敌人初始化
        const ec = enemyNode.getComponent(StaticCharacters);
        if (ec) {
            ec.setEnemy(new Skull1()); // 放入一个骷髅
        }
    }

    /**
     * 查找一个空闲的位置节点 (优先找前排)
     * @returns 返回一个没有子节点的空位置节点，如果没有则返回null
     */
    private findAvailablePosition(): Node | null {
        // 优先遍历前排位置
        for (const pos of this.frontRowPositions) {
            if (pos.children.length === 0) {
                return pos; // 找到空位，返回它
            }
        }

        // 如果前排满了，再遍历后排位置
        for (const pos of this.backRowPositions) {
            if (pos.children.length === 0) {
                return pos; // 找到空位，返回它
            }
        }

        return null; // 所有位置都满了
    }

    /**
     * 清理所有敌人
     */
    public clearAllEnemies() {
        for (const pos of this.frontRowPositions) {
            pos.removeAllChildren();
        }
        for (const pos of this.backRowPositions) {
            pos.removeAllChildren();
        }
    }
}