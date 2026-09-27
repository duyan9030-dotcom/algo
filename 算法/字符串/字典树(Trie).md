字典树（Trie），又称前缀树（Prefix Tree）或单词查找树，是一种用于**高效存储和检索字符串**的树形数据结构。它的核心优势在于将字符串查询的时间复杂度从依赖词库规模优化到了**严格依赖于所查询字符串的长度 $O(L)$**，极大地加速了前缀匹配过程。

以下是该数据结构的详尽原理解析及典型 C++ 实现（以传统的面向对象方式为例）。

### 一、 核心思想：利用公共前缀，空间换时间

在传统的哈希表中，所有的单词都是孤立存储的。如果要查询 `apple` 和 `app`，哈希表会将它们视作完全独立的两条记录。

字典树的核心在于：**把字符串拆开，每个节点只存储一个字符的连接关系；如果有多个字符串拥有相同的开头（前缀），那么它们在树上将共享这部分相同的路径。**

### 二、 核心特征与物理结构

#### 1. 结构特征

- **根节点不存储具体字符**：根节点代表一个空起点。
    
- **边（或子节点指针）代表字符**：从当前节点走到下一个节点的“路”就代表了某个字符。
    
- **路径即单词**：从根节点出发，顺着指针往下走，把经过的路径拼接起来，就构成了前缀或完整单词。
    
- **尾部标记**：由于 `app` 是 `apple` 的前缀，光看路径无法区分存的是 `app` 还是 `apple`，因此必须在代表单词结尾的那个节点上打一个标记（例如 `isEnd = true`）。
    

#### 2. 节点的设计（Node）

一个标准的字典树节点通常包含两个关键部分：

- **子节点指针数组（或哈希表）**：假设只处理 26 个小写英文字母，那么每个节点内部需要维护一个大小为 26 的指针数组。如果 `children[0]` 为空，代表当前节点的下一层没有字母 `a`；如果不为空，说明有 `a` 并且该指针指向下一个节点。
    
- **结尾标记（布尔值）**：`bool isEnd`，用来表示当前节点是否是某个完整单词的结束位置。
    

### 三、 核心操作步骤

#### 1. 插入单词 (Insert)

假设我们要插入单词 `"cat"`。

1. **初始状态**：从根节点（Root）开始。
    
2. **找第一个字符 'c'**：检查当前节点（Root）的子节点数组，看对应字母 'c' 的指针是否存在。
    
    - 如果不存在，创建一个新节点，并让指针指向它。
        
    - 将当前操作位置向下移动到这个新节点。
        
3. **找第二个字符 'a'**：在刚才移动到的节点上，重复上述过程，找代表 'a' 的子节点，若无则建，移动过去。
    
4. **找第三个字符 't'**：同理，建节点并移动过去。
    
5. **打标记**：此时 `"cat"` 的所有字符都处理完毕。在最后停留的这个节点上，设置 `isEnd = true`。
    

#### 2. 查找完整单词 (Search)

假设我们要查找 `"cat"`。

从根节点出发，顺着单词的字母逐级向下走：

- 如果在中途发现某个字母的子节点指针为空（即路断了），说明该单词根本没有被插入过，直接返回 `false`。
    
- 如果顺利走完了 `"cat"` 的所有字符，最后要**检查停留节点的 `isEnd` 是否为 `true`**。如果是，说明查到了完整单词；如果为 `false`（比如树里存的是 `"cats"`），说明 `"cat"` 只是一个前缀，并未作为独立单词插入过。
    

#### 3. 查找前缀 (StartsWith)

假设我们要查询是否有以 `"ca"` 为前缀的词。

过程与查找单词完全一样，顺着字母向下走：

- 如果在中途路断了，返回 `false`。
    
- 如果顺利走完了 `"ca"` 的所有字符，**不需要检查 `isEnd`**，直接返回 `true`，因为只要路通着，就说明一定有以该路径开头的单词存在。
### C++ (STL) 翻译模板



```C++
// 如果将来增加了数据量，就改大这个值
const int MAXN = 2000001;
// tree 数组记录节点的前往路径，大小为 MAXN * 12
int trie_tree[MAXN][12];
// pass 数组记录经过该节点的字符串数量
int pass[MAXN];
// 节点分配计数器
int cnt;
// 初始化根节点
void build() {
    cnt = 1;
}

// 字符映射函数
// '0' ~ '9' 映射为 0~9
// '#' 映射为 10
// '-' 映射为 11
int get_path(char cha) {
    if (cha == '#') {
        return 10;
    } else if (cha == '-') {
        return 11;
    } else {
        return cha - '0';
    }
}

// 向字典树中插入字符串
void insert(const string& word) {
    int cur = 1;
    pass[cur]++;
    for (int i = 0, path; i < word.length(); i++) {
        path = get_path(word[i]);
        if (trie_tree[cur][path] == 0) {
            trie_tree[cur][path] = ++cnt;
        }
        cur = trie_tree[cur][path];
        pass[cur]++;
    }
}

// 查询前缀出现的次数
int count_pre(const string& pre) {
    int cur = 1;
    for (int i = 0, path; i < pre.length(); i++) {
        path = get_path(pre[i]);
        if (trie_tree[cur][path] == 0) {
            return 0;
        }
        cur = trie_tree[cur][path];
    }
    return pass[cur];
}

// 清理使用过的节点空间
void clear_trie() {
    for (int i = 1; i <= cnt; i++) {
        // C++ 中使用 memset 快速将数组按字节置零
        memset(trie_tree[i], 0, sizeof(trie_tree[i]));
        pass[i] = 0;
    }
}

// 核心计算逻辑翻译
vector<int> countConsistentKeys(const vector<vector<int>>& b, const vector<vector<int>>& a) {
    build();
    string builder = "";
    
    // 构建 a 数组的差值字符串并插入字典树
    // [3,6,50,10] -> "3#44#-40#"
    for (const auto& nums : a) {
        builder.clear();
        for (size_t i = 1; i < nums.size(); i++) {
            builder += to_string(nums[i] - nums[i - 1]) + "#";
        }
        insert(builder);
    }
    
    vector<int> ans(b.size(), 0);
    
    // 构建 b 数组的差值字符串并在字典树中查询匹配次数
    for (size_t i = 0; i < b.size(); i++) {
        builder.clear();
        const auto& nums = b[i];
        for (size_t j = 1; j < nums.size(); j++) {
            builder += to_string(nums[j] - nums[j - 1]) + "#";
        }
        ans[i] = count_pre(builder);
    }
    
    clear_trie();
    return ans;
}
```
### 五、 复杂度分析

假设我们要插入或查询的字符串长度为 $L$。

- **时间复杂度：严格的 $O(L)$**
    
    无论是插入、查找完整单词还是查找前缀，都只需要将给定的字符串遍历一遍。在每一层通过索引去访问数组 `children[index]` 都是 $O(1)$ 的操作。总共往下走 $L$ 步，耗时 $O(L)$。查询速度与字典树中存了多少百万级别的单词没有任何关系。
    
- **空间复杂度：最高 $O(N \times \text{字符集大小})$**
    
    其中 $N$ 是所有插入字符串的长度总和。最坏情况下（没有任意两个字符串有公共前缀），每插入一个字符就需要 `new` 一个带有 26 个指针的节点数组。这正是“空间换时间”的体现。但在实际场景中，大量单词会共享前缀，实际节点数远小于纯字符串长度之和。