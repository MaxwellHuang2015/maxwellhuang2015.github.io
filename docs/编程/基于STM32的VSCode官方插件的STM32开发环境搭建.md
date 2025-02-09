---
title: 基于STM32的VSCode官方插件的STM32开发环境搭建
tags:
  - STM32
  - VSCode
  - IDE
  - Toolchain
  - OpenOCD
  - 
createTime: 2025/02/09 18:58:09
permalink: /article/05um3mo2/
---

## 前言碎碎念

很多人可能觉得，STM32开发使用什么IDE，使用什么工具链，不都行吗，何必折腾。其实如果只是简单写几个程序，或者程序的复杂度不高，变量不多，那么确实用啥都能行。毕竟共享单车、出租车、自驾、公交都一样可以解燃眉之急。但是一旦使用的多，比方说有很多的库，或者很多函数定义，需要更加**方便的跳转**，**方便的代码搜索**，**美观易看的界面**，同时又具备一定的**深入理解**的需要，那么此时强烈建议你去体验和尝试不同的开发环境方案，不同的编辑器带来的便利是天差地别的！可能人都倾向于安于现状，但是如果有时间，建议逼自己一把，跳出舒适圈，说不定能够掌握更多意想不到的知识，收获更多意想不到的优质体验。

> [!tip]
> **利用STM32在VSCode的官方插件，搭配STM32的配套软件以及OpenOCD开源调试器软件，为VSCode搭建STM32的开发环境**

这是接下来要介绍的方案。对于青睐于VSC的用户是个非常优雅的选择，可以实现一个VSC走天下。该方案能够在Windows、macOS、Linux全平台搭建，而且最主要的，即便我不需要进行烧录调试，纯粹看看代码，VSC相比于其他常用的方案，都能够以最轻便快速和便捷的方案去实现代码的查阅（VSC轻便的就像Windows自带的记事本）。

如果使用的是==STlink==烧录器，那么OpenOCD是不需要安装的。该方案带来麻烦的点都来源于不用STLink进行烧录调试。所以只要使用STLink，那么该方案搭建是十分简便的，复杂程度与Keil软件安装持平。

如果使用==DAPLink==、==JLink==等**非STLink**的烧录器，那么才需要安装OpenOCD，并且后续的工程项目中需要相应手动添加一些烧录、调试的json配置语句。

接下来以Windows系统为例进行讲解。macOS和Linux系统可对照每个步骤自行调整

## 环境搭建

### 软件环境
- Windows 10/11
- STMSTM32 CubeMX（最低版本v6.11.0）
- STM32 CubeCLT（最低版本v1.15.0）
- OpenOCD
- Visual Studio Code

### 软件安装和配置


#### **STM32 CubeMX安装**

前往STM32 CubeMX的[官方网站](https://www.st.com.cn/zh/development-tools/stm32cubemx.html)，注册个人账号并登录后即可以下载。<Plot>反正不注册的话后续也没法用。</Plot>该软件可用于界面化地对STM32的芯片的外设、时钟、中断等配置按照指定的支持的开发方式生成自带初始化代码的工程项目。请确保下载最新版的软件！

如果已经安装了CubeMX，请确保软件的版本新于v6.11.0，该版本相比旧版本在最后生成C工程项目时候，新增加了CMake版本的开发方案。值得一提的是，新增加CMake的方案其实也是STM32官方在配合推进VS Code的插件、进而推进使用VS Code开发STM32的一大功能更新，后续的CubeCLT、VS Code插件安装也同样需要注意是否满足最低版本。

> [!important]
> **版本新于6.11.0！安装该软件不要有中文路径！**

::: center
![alt text](/blog_images/stm32-vscode/old_cubemx.png)

![alt text](/blog_images/stm32-vscode/new_cubemx.png)
:::

#### **STM32 CubeCLT安装**

前往STM32 CubeCLT的[官方网站](https://www.st.com.cn/zh/development-tools/stm32cubeclt.html)，注册个人账号并登录后即可以下载。<Plot>反正不注册的话后续也没法用。</Plot>该软件提供了所有STM32的MCU的开发工具集，面向的正是诸如VS Code之类的第三方开发IDE，为其在STM32的MCU的编译、烧录、调试、链接等方面提供命令行工具。

> [!important] 
> **安装该软件不要有中文路径！**

::: center
![alt text](/blog_images/stm32-vscode/cubeclt_folder.png)
:::

打开CubeCLT的安装目录，可以看到该工具包都有些什么。
- **CMake**

    CMake工具，工程项目将用CMake进行项目的代码文件的项目管理，能够进一步生成Makefile或者Ninja对编译进行编排。具体可以去了解CMake和Makefile、Ninja。

- **drivers**

    STLink烧录器的驱动。

- **GNU-tools-for-STM32**
        
    其实就是给arm内核平台用的C/C++编译器arm-none-eabi-gcc。该工具在CLion的开发环境方案中亦有记载。

- **jre**

    命令行工具程序是用Java写的。这是CubeCLT的Java的Runtime也就是运行时环境。

- **Ninja**

    与Makefile一样，通过脚本语言指定编译规则，实现项目工程利用gcc自动化编译。

- **STLink-gdb-server**

    用于联结调试程序用的gdb程序和STLink调试器——解析gdb调试程序的命令，以及来自硬件的调试数据，从而实现利用电脑gdb程序配合STLink去试器去调试MCU的功能。

- **STLinkServer**

    用于让多个程序可以共享使用一个STLink调试器的软件工具。
        
- **STM32CubeProgrammer**

    其实就是顺带把CubeProgrammer工具安装了。该工具用于擦除烧录读取验证MCU的Flash的内容等功能，支持STLink调试器、USB DFU/UART等自举接口等等的方式。
        
- **STM32target-mcu**

    存放所有STM32的MCU芯片的所有型号的状态、对应的SVD、封装以及内部Flash地址偏移值等等，类似与芯片选型列表。
        
- **STMicroelectronics-CMSIS-SVD**

    存放着所有STM32的MCU芯片的系统视图说明（System View Description），讲人话就是芯片的外设信息Datasheet的一种标准化的文件。SVD文件定义了MCU的外设寄存器、数据宽度等各项信息，是编译生成MCU固件的必备文件。
        
#### **OpenOCD安装**
   
> [!tip]
> **若使用STLink，可跳过该步骤**

OpenOCD（Open On-Chip Debugger）是个多平台开源项目，旨在为所有的嵌入式芯片以及所有的调试仿真器提供开源的烧录调试驱动软件。具体若想了解可以前往其[官网](https://openocd.org/)。也可以访问其开源[Github](https://github.com/openocd-org/openocd)。

代码以及相应打包好的软件（我们将要安装的）在其GitHub的Realse中可以获取。截稿时，OpenOCD的最新稳定版本是0.12.0，懒得去Github找也可直接点击[下载链接](https://github.com/openocd-org/openocd/releases/download/v0.12.0/openocd-v0.12.0-i686-w64-mingw32.tar.gz)。

::: center
![alt text](/blog_images/stm32-vscode/openocd-github.png)

![alt text](/blog_images/stm32-vscode/openocd-download.png)
:::

下载完成得到的压缩包，解压缩并存放到合适的位置。
   
> [!important]
> **文件路径中不要有中文，也不要有空格！**
   
推荐按照图中所示，将文件夹命名为openocd-0.12.0，并确保刚刚下载的OpenOCD软件的压缩包完整解压存放其中。并记录下openocd.exe的文件路径，例如图中的是**C:\openocd-0.12.0\bin**
   
::: center
![alt text](/blog_images/stm32-vscode/openocd-foler.png)
:::
   
接下来添加OpenOCD的可执行文件路径到Windows系统的环境变量中：
 
Win+S -> 输入“环境变量” -> 点击“环境变量”->双击“系统变量”中“Path”变量->点击“新建”->输入刚刚的OpenOCD软件的路径“C:\openocd-0.12.0\bin”-> 回车，确定*3 -> 重启电脑

::: center
![alt text](/blog_images/stm32-vscode/syspath1.png)

![alt text](/blog_images/stm32-vscode/syspath2.png)

![alt text](/blog_images/stm32-vscode/syspath3.png)
:::

接下来可以通过CMD命令行调用到OpenOCD程序了：

Win+R -> cmd -> 回车 -> 输入指令“openocd -v”，如果前边操作无误，此处可以得到OpenOCD返回输出的版本信息，类似下图。

```shell
openocd -v
```

::: center
![alt text](/blog_images/stm32-vscode/openocd-cmd.png)
:::

**Visual Studio Code安装**

VS Code这个软件的安装，前往[官网](https://code.visualstudio.com/)下载最新版一路继续安装即可。接下来安装相关必要插件。

:::: steps
1. **Chinese (Simplified) Language Pack**

    该插件用于汉化。不喜欢中文界面的也可不装。

    :::center
    ![alt text](/blog_images/stm32-vscode/chinese-ext.png)
    :::

2. **STM32 VS Code Extension**
   
    > [!important]
    > **确保插件的版本是新于2.0.0的版本！**
    
    2.0.0版本更新发布于2024.04.03，是与STM32 CubeMX的v6.11版本是相配合的，请确保安装的是最新版本的插件。截止于成文日期2025.02.02，该插件的最新版本是2.1.1。

    :::center
    ![alt text](/blog_images/stm32-vscode/stm32-ext.png)
    :::

    安装该插件时，会自动安装上C/C++ Extension Pack、CMake、Cortex-Debug等一系列必需的其他插件。

    :::center
    ![alt text](/blog_images/stm32-vscode/requre-ext.png)
    :::

    完成安装后，通过VSC的插件栏，调出STM32插件的设置页面，确认**CubeMX.exe**和**CubeCLT**的路径是否都正确添加到了STM32插件设置中。
    > [!important]
    > **要把CubeMX的可执行文件的名字也加进去，而不是仅仅到其所在文件夹！**

3. **（可选不必须）Better C++ Syntax、openocd-tools**
   
   :::center
   ![alt text](/blog_images/stm32-vscode/c++-ext.png)
   :::
   
   Better C++ Syntax插件是用于让C/C++代码的空格、缩进和括号等代码样式规范的自动化插件，可以把整个代码文件一键进行样式美化。

   :::center
   ![alt text](/blog_images/stm32-vscode/opemocd-ext.png)
   :::

   openocd-tools插件应该是国内个人开发者在STM32的官方VS Code插件发布之后为了方便使用开发的。但是吧…截止至该文档完成时，我是只成功地利用该插件实现了程序的编译烧录，但是暂未能成功进行调试。具体原因未知。

::::

## 开发示例

### 硬件环境

- STM32F103ZET6开发板
- DAPLink调试器

### 功能

让接在PG12的LED灯闪烁，通过烧录下载和调试仿真两种方式




## 其他开发环境方案

此处仅讨论HAL库开发！由于STM32官方已经舍弃了固件库的维护，并且固件库的学习成本和使用便捷度都不尽人意，因此个人觉得，在基于简单的任务了解完STM32底层结构以及固件库的工作原理之后，就不要在固件库里钻了。因此接下来的方案，都是基于HAL开发的方案。而且现阶段以及未来，开发工具也都是为HAL服务居多，固件库注定渐渐成为历史，顶多就是满足特殊需求的备选方案。具体的信息可以参考[STM32开发环境方案](/mcu/).


::: file-tree 
- cmake/
- Core/
- Drivers/
- .mxproject
- CMakeLists.txt
- CMakePresets.json
- \$project_name\$.ioc
- startup_stmxxxxx.s
- stmxxxxxxx.ld
:::