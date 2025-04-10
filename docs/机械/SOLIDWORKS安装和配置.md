---
title: SOLIDWORKS安装和配置
tags:
  - 软件安装
  - 机械
createTime: 2025/02/09 18:53:17
permalink: /article/SW_installation/
---

## 前言

SOLIDWORKS软件作为学生和科研工作者中常用的3D设计建模仿真软件，是个很强力的工具。虽说SOLIDWORKS软件里能向下兼容旧版本的工程文件，但是

> [!important]
> 根据实际验证发现，**并非版本越新，就能保证兼容一切，尽量保证使用匹配版本的软件打开工程文件**

实践中，曾经有过2024版本的SW打开特定某个旧版本的工程文件时发生软件崩溃，经过一夜排查最后发现需要将版本降到2023才能解决。因此如果发现有类似的问题，可以尝试降级软件解决问题。

## 软件环境

- Win10/11
- SOLIDWORKS 2021

## 目标要求

卸载旧版本的SOLIDWORKS，装上SOLIDWORKS 2023版

## 软件获取

这个可以到很多地方去搜索，比较简单和靠谱的方式是到[B站](https://www.bilibili.com/)或者搜索引擎例如[谷歌](https://www.google.com/)和[必应](https://cn.bing.com/)进行搜索。本文安装的是SOLIDWORKS 2023.SP5.0. Premium，提供一下我的[获取链接](https://pan.baidu.com/s/1BM0GdIk94jZBxkAz1x2CrA?pwd=YYDS)

## 旧版卸载

### 方法一

必须保证把旧版本卸载干净，特别是注册表也得清理干净，才能保证正常安装新版本。正常进入卸载界面时，在详细页面可以弹出把所有的选项都勾选上。

### 方法二

参考这个[链接](https://blog.csdn.net/weixin_31157123/article/details/112625908)。

### 方法三

正常卸载之后，利用Uninstaller Tool软件，辅助帮忙找出注册表清理干净一些残存的注册表项目和文件夹以及软件

### 卸载常见问题

1. 可能前序安装或者注册表没有处理干净，或者是什么误操作，导致SW的程序文件夹直接删除，但是此时注册表里依旧是记录了你安装了一半，或者是已经安装
[无法重新安装](https://blog.csdn.net/weixin_61203118/article/details/127391046)
但是请不要使用里头说的Auto_Uninstaller，据说[是个丝圈夹的流氓软件](https://www.bilibili.com/opus/760951721276997697)

2. 

> [!note]
> 我是利用Geek Uninstaller + Uninstall Tool + 手动删除
>
> 

## SOLIDWORKS安装