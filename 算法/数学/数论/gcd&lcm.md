在算法竞赛中，最大公约数 (GCD) 和最小公倍数 (LCM) 是数论最基础的构建块，频繁出现在各类数学推导、区间查询以及构造题中。

## 核心实现与内置函数

在竞赛中，最常用的是**欧几里得算法（辗转相除法）**。其核心思想基于定理：$\gcd(a, b) = \gcd(b, a \bmod b)$。

C++

```C++
// 手写实现，时间复杂度 O(log(min(a, b)))
long long gcd(long long a, long long b) {
    return b == 0 ? a : gcd(b, a % b);
}

// LCM 实现：先除后乘防止溢出
long long lcm(long long a, long long b) {
    return a / gcd(a, b) * b; 
}
```

**竞赛捷径：**

如果你使用 C++17 或更高版本，可以直接包含 `<numeric>` 头文件，使用标准库函数 `std::gcd(a, b)` 和 `std::lcm(a, b)`。这不仅代码更短，且内部经过优化（如底层可能使用二进制 GCD 算法 `__builtin_ctz`），常数更小。

## 竞赛中的核心性质

掌握以下性质往往是解开 Codeforces 等平台上思维题（Ad-hoc / Math）的关键：

1. **乘积关系**：
    
    $a \times b = \gcd(a, b) \times \text{lcm}(a, b)$
    
2. **结合律与交换律**：
    
    多个数的 GCD 或 LCM 可以逐个合并：$\gcd(a, b, c) = \gcd(\gcd(a, b), c)$。
    
1. **更相减损性质（差分 GCD）**：
    
    $\gcd(a, b) = \gcd(a, \vert{}a - b\vert{})$
    
    推论到多个数：$\gcd(a_1, a_2, \dots, a_n) = \gcd(a_1, a_2 - a_1, \dots, a_n - a_{n-1})$。
    
    _应用场景_：当题目要求对一个区间 $[L, R]$ 加上一个常数 $x$，并查询区间的 GCD 时，可以直接对差分数组维护线段树，因为区间加上 $x$ 后，其内部元素的差分值是不变的，只有端点发生了改变。
    
2. **值域收敛极快**：
    
    一个数列的前缀 GCD 序列：$g_i = \gcd(a_1, \dots, a_i)$ 是单调不增的。
    
    更重要的是，每次 $g_i$ 发生变化时，至少会缩小一半。因此，对于任意长度的数组，其前缀 GCD 的不同取值最多只有 $\log_2(\max(A))$ 种。这个性质常被用来做枚举或分治。

## 常见考点与高阶技巧

### 1. 裴蜀定理 (Bézout's Identity)

**定理内容**：对于任意整数 $a, b$，关于 $x, y$ 的线性丢番图方程 $ax + by = c$ 有整数解，当且仅当 $\gcd(a, b) \mid c$。

**竞赛体现**

- 题目问“能否通过每次加减 $a$ 和 $b$ 得到 $c$”，本质就是判断 $c \bmod \gcd(a, b) == 0$。
    
- 多个数的推广：$\sum_{i=1}^n a_i x_i = c$ 有解的充要条件是 $\gcd(a_1, a_2, \dots, a_n) \mid c$。  

### 2. 扩展欧几里得 (exgcd)

用于在求 $\gcd(a, b)$ 的同时，求出 $ax + by = \gcd(a, b)$ 的一组特解 $(x, y)$。

C++

```C++
long long exgcd(long long a, long long b, long long &x, long long &y) {
    if (b == 0) {
        x = 1; y = 0;
        return a;
    }
    long long g = exgcd(b, a % b, y, x);
    y -= (a / b) * x;
    return g;
}
```

**竞赛应用**：求解模逆元（当模数不是质数时），或求解一般的线性同余方程 $ax \equiv c \pmod m$。

### 3. 区间 GCD 查询 (ST表与线段树)

由于 GCD 满足**可重复贡献性质**（即 $\gcd(a, a) = a$），非常适合用 Sparse Table (ST表) 来维护。

- **预处理复杂度**：$O(N \log N \log(\max A))$
    
- **查询复杂度**：$O(1)$ 或 $O(\log(\max A))$
    
    当题目没有修改操作，只需频繁查询区间 GCD 时，ST表是绝对的首选。如果有单点修改，则需要使用线段树。  

### 4. 质因数分解视角

从唯一分解定理看：

假设 $a = p_1^{x_1} p_2^{x_2} \dots p_k^{x_k}$， $b = p_1^{y_1} p_2^{y_2} \dots p_k^{y_k}$

- $\gcd(a, b) = \prod p_i^{\min(x_i, y_i)}$ 
    
- $\text{lcm}(a, b) = \prod p_i^{\max(x_i, y_i)}$
    
    **竞赛应用**：当直接计算 LCM 会导致高精度爆炸，或者需要求概率/期望时，可以通过筛法（如 Euler 筛）先对数字进行质因数分解，维护各质因子的最大指数。