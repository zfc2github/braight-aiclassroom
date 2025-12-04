# 原始数据集

- [345个类别的enpy二进制编码完整数据集 - Google Cloud](https://console.cloud.google.com/storage/browser/quickdraw_dataset/full/numpy_bitmap;tab=objects?prefix=&forceOnObjectsSortingFiltering=false)
- [quickdraw-dataset - GitHub](https://github.com/googlecreativelab/quickdraw-dataset#get-the-data) GitHub上的quickdraw数据集介绍

## 预处理

我们从原始数据集中7个人一起人工筛选了一天，得到了筛选后的高质量图片数据集。

[archives/eng_to_chn.json](./archives/eng_to_chn.json)：将345个标签从英文转为中文的json索引，可以用一下代码将json读取为Python中的字典：（该文件生成的代码在[./filter/translate_eng_to_chn.py](./filter/translate_eng_to_chn.py)）

```python
import json
with open("eng_to_chn.json", "r", encoding="utf-8") as file:
    json.load(file)
```

[filter/](./filter)：该文件夹下存储了**网页图片筛选系统**项目所用的全部代码，需要结合`./archives`中的配置文件`eng_to_chn.json`和`target_labels.txt`使用。由于原始数据集中存在大量不精确图片，该项目是为筛选数据集所建立的网页筛选系统，**支持多人在同一局域网下，同时筛选数据集中不同类别下的图片**。

[dataset_selected](./dataset_selected)：我们小组人工筛选出的最终数据集，**包含210个类别总共64341张图片**，由于部分标签难以通过简笔画绘制，所以我们又从全部的347个类别中选出**210个类别**（类别名文件：[target_labels.txt](./archives/target_labels.txt)）作为我们的筛选的目标类别，其中**每个类别**我们筛选至少**300张图片**。
