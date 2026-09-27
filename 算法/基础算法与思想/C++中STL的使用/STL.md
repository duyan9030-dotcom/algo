## 序列式容器 (Sequence Containers)

- **`std::vector` (动态数组)**: 内存连续，支持快速随机访问（时间复杂度 `O(1)`）。尾部插入和删除极快，但中间或头部操作会导致数据搬移，效率较低。
    
    - **常用操作**: `push_back()`, `pop_back()`, `size()`, `clear()`, `[]` (索引访问)。
        
- **`std::list` (双向链表)**: 内存不连续，不支持随机访问。但在任何已知迭代器位置进行插入和删除的效率都极高（`O(1)`）。
    
    - **常用操作**: `push_front()`, `push_back()`, `insert()`, `erase()`。
        
- **`std::deque` (双端队列)**: 类似于 `vector`，分段连续，支持在头部和尾部都进行快速插入和删除（`O(1)`）。
    
    - **常用操作**: `push_front()`, `pop_front()`, `push_back()`, `pop_back()`, `[]`。

## 关联式容器 (Associative Containers)

- **`std::map` / `std::unordered_map` (字典/映射)**: 存储键值对 (Key-Value)。`map` 底层为红黑树，键自动排序，查找为 `O(log N)`；`unordered_map` 底层为哈希表，无序，查找通常为 `O(1)`。
    
    - **常用操作**: `insert()`, `erase()`, `find()`, 以及通过 `map[key] = value` 进行赋值或读取。
        
- **`std::set` / `std::unordered_set` (集合)**: 存储唯一的元素，自动去重。`set` 内部有序，`unordered_set` 无序。
    
    - **常用操作**: `insert()`, `erase()`, `find()`, `count()` (常用于判断某元素是否存在，返回 1 或 0)。
## 容器适配器 (Container Adapters)

- **`std::stack` (栈)**: 后进先出 (LIFO)。只能在栈顶进行读写操作，底层通常由 `deque` 实现。
    
    - **常用操作**: `push()` (压栈), `pop()` (出栈，无返回值), `top()` (获取栈顶元素), `empty()` (判空)。
        
- **`std::queue` (队列)**: 先进先出 (FIFO)。尾部入队，头部出队。
    
    - **常用操作**: `push()` (入队), `pop()` (出队), `front()` (获取队头), `back()` (获取队尾)。
        
- **`std::priority_queue` (优先队列)**: 本质是堆（默认大顶堆）。每次使用 `top()` 取出的元素总是当前队列中最大的。
    
    - **常用操作**: `push()`, `pop()`, `top()`。

## 常用算法 (`<algorithm>`)

- **`std::sort(begin, end)`**: 对指定范围内的元素进行排序（默认升序）。可通过传入自定义比较函数或 Lambda 表达式实现降序或结构体排序。
    
- **`std::find(begin, end, value)`**: 在线性时间复杂度内查找特定值，返回指向该元素的迭代器。若未找到，则返回 `end` 迭代器。
    
- **`std::reverse(begin, end)`**: 将指定范围内的元素顺序首尾翻转。
    
- **`std::max_element(begin, end)` / `std::min_element`**: 返回指向指定范围内最大或最小元素的迭代器。