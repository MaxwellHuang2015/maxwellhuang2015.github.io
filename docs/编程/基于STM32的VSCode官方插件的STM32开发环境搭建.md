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
permalink: /article/stm32-vscode/
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

按照以下顺序安装和配置软件

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

::: code-tabs
@tab cmd.exe
```shell
openocd -v
```
:::

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
- STLink调试器/DAPLink调试器

### 功能

让接在PG12的LED灯闪烁，通过烧录下载和调试仿真两种方式

### STM32 CubeMX生成项目

:::center
![alt text](/blog_images/stm32-vscode/cubemx-new.png)
:::

打开STM32 CubeMX，搜索F103ZET6芯片，双击如图右下角筛选出的所需芯片。

:::center
![alt text](/blog_images/stm32-vscode/cubemx-selectchip.png)
:::

:::: steps
1. **外设配置**
   
   ==System Core->SYS==中的Debug选择Serial Wire

   :::center
   ![alt text](/blog_images/stm32-vscode/swd.png)
   :::

   ==System Core->RCC==中的HSE选择外接晶振（我的开发板外接了晶振）

   :::center
   ![alt text](/blog_images/stm32-vscode/rcc.png)
   :::

   ==Pinout view==的下方搜索框找到连接LED灯的GPIO管脚，我的开发板上是PG12管脚，设置初始化为低电平，低速推挽输出，不接上拉也不接下拉。为了方便后续变成，为其赋予定制标签LED

   :::center
   ![alt text](/blog_images/stm32-vscode/pinout_view.png)

   ![alt text](/blog_images/stm32-vscode/pinout_view2.png)

   ![alt text](/blog_images/stm32-vscode/gpio.png)
   :::

2. **时钟配置**
   
   在Clock Configuration中为外设配置好工作时钟。我手上的开发板的外接晶振是8M，我打算利用STM32内部的锁相环倍频到最高的72MHz。

   :::center
   ![alt text](/blog_images/stm32-vscode/clock.png)
   :::

3. **项目配置**
   
   在Project Manager中，做最后的工程项目生成配置设置。设置项目工程文件夹以及工程名称，选择生成的Toolchain方案为==CMake==。

   :::center
   ![alt text](/blog_images/stm32-vscode/project-manage.png)
   :::

   在Code Generator中选择**Copy only the necessary library files**，这样项目只会将用到的外设的库文件添加到项目文件夹中，相对比较节省空间；勾选**Generate peripheral initialization as a pair of ‘.c/.h’ files per peripheral**，可以比较好地模块化外设的初始化以及相关功能代码。

   :::center
   ![alt text](/blog_images/stm32-vscode/code-gen.png)
   :::
   
   至此即完成了设置，点击右上角的==GENERATE CODE==既可生成工程项目。记得直接点==Close==。
   
   > [!important]
   > **不要点==Open Folder==！点==Open Folder==会有概率卡死**

   :::center
   ![alt text](/blog_images/stm32-vscode/project-dir.png)
   :::

   自行前往生成的工程文件夹，可以看到CubeMX配置文件.ioc文件、启动文件.s文件、用于设置堆栈空间大小的链接脚本文件.ld文件、CMake相关的CMakelists.txt和CMakePresets.json文件。Core文件夹是STM32上的功能代码，届时我们编写的程序也将存放在此；Drivers文件夹是HAL库相关库文件。去掉示例项目中特有的项目名称和芯片型号，正常你生成的项目文件夹结构将如下

   ::: file-tree 
   - cmake/
   - Core
     - Inc/
     - Src/
   - Drivers
     - CMSIS/
     - STMxxxxxx_HAL_Driver/
   - .mxproject
   - CMakeLists.txt
   - CMakePresets.json
   - \$project_name\$.ioc
   - startup_stmxxxxx.s
   - stmxxxxxxx.ld
   :::

::::

### VSCode中导入项目

打开VSCode软件，如果提示“处于限制模式下”，点击“信任”。点击左侧边栏的STM32插件图标，进入到STM32插件功能界面。点击==Import CMake project==，选择刚刚生成的LED_Toggle项目文件夹。

::: center
![alt text](/blog_images/stm32-vscode/import-pj.png)

![alt text](/blog_images/stm32-vscode/finishimport.png)
:::

随后在VSCode上方会自动弹出由插件识别得到的项目的相关信息，包括：项目目录地址、项目类型、项目的芯片以及工具链。确认无误点击弹出栏目的最后一项==Import project==即可完成项目的导入。随后VSCode右下角会弹出让你选择如何处理导入完成的项目文件夹。

::: center
![alt text](/blog_images/stm32-vscode/finishimport2.png)
:::

如果弹出“是否信任此文件夹中的文件的作者”，点击信任即可。此时可以看到，文件夹中自动生成生成添加了一些文件。

::: center
![alt text](/blog_images/stm32-vscode/cmakepj.png)
:::

正常情况下现在的文件结构会是这样的，.vscode是VSCode生成的存放与项目相关的配置文件和设置，后续我们的编译任务和调试任务所对应的相关操作就存储于此；build.ninja和底下的cmake都是关于CMake和ninja编译工具的相关文件。

::: file-tree 
- .vscode
  - c_cpp_properties.json
  - extensions.json
  - launch.json
  - tasks.json
- cmake/
- Core/
  - Inc/
  - Src/
- Drivers/
  - CMSIS/
  - STMxxxxxx_HAL_Driver/
- .mxproject
- build.ninja
- cmake_install.cmake
- CMakeCache.txt
- CMakeLists.txt
- CMakePresets.json
- \$project_name\$.ioc
- startup_stmxxxxx.s
- stmxxxxxxx.ld
:::

一般会自动弹出这个选择预设配置的窗口，选择Debug既可。后续也可以在侧边栏的==CMake->配置==栏目中切换选择CMakePresets.json中的不同配置。

::: center
![alt text](/blog_images/stm32-vscode/debugconfig.png)
:::

### 代码编写编译生成程序

我们在main.c中添加闪烁LED的代码。
> [!important]
> **注意自己的代码一定要写在已有代码的注释/\* USER CODE BEGIN xxx \*/和/\* USER CODE END xxx \*/之间**

否则一旦后续去CubeMX更新配置，重新生成，就会被覆盖。接下来可以看到，VSCode在编辑器上的强大功能了——除了自动弹出匹配，还能显示函数的使用说明，这些都是不需要去做配置就自动具备的功能。

::: center
![alt text](/blog_images/stm32-vscode/coding.png)
:::

左侧的==大纲==可以查看当前代码文件中函数列表。

::: center
![alt text](/blog_images/stm32-vscode/maincode.png)
:::

完成编写后，点击下方状态栏的==生成==，若无误会输出代码的大小信息。

::: center
![alt text](/blog_images/stm32-vscode/build.png)

![alt text](/blog_images/stm32-vscode/output.png)
:::

在输出框中可以看到相关的状态信息，如果代码有错误，此处会出错，可以看到左下角的打叉的图标上数量不为0，点击可以在==问题==栏中看到语法错误信息。

::: center
![alt text](/blog_images/stm32-vscode/problem.png)
:::

如果代码正常并且正常编译生成程序，会在./build/Debug文件夹里看到LED_Toggle.elf程序文件。

### 通过STLink烧录和调试

#### 烧录

如果使用的是STLink，那么烧录和调试的指令都已经自动生成了，只需要接好调试器，点点鼠标即可。在左边侧边栏中点开==CMake==菜单，点击下方的==固定的命令->运行任务==，上方会弹出已配置好的可运行的任务供选择。或者在菜单栏选择==终端->运行任务==。

::: center
![alt text](/blog_images/stm32-vscode/runtask.png)

![alt text](/blog_images/stm32-vscode/runtask2.png)
:::

弹出的四个任务选项，其实就记载在了<strong>./.vscode/task.json</strong>文件中，

- **CMake: clean rebuild**
  
  删除原本生成的程序并重新生成程序

- **CubeProg: Flash project (SWD)**
  
  通过STLink将程序利用单片机的SWD口烧录到单片机上
  
- **CubeProg: List all available communication interfaces**
  
  用来列举电脑上现在有那些可供CubeProgammer利用来烧录STM32程序的接口

- **Build + Flash**
  
  其实就是先执行“CMake: clean rebuild”任务以生成程序文件，然后再执行“CubeProg: Flash project (SWD)”以烧录程序。

::: center
![alt text](/blog_images/stm32-vscode/origintasks.png)
:::

我们之前已经生成了程序，这里只需要点击第三项==CubeProg: Flash project (SWD)==即可实现程序烧录下载。

#### 调试

点击侧边栏的==运行和调试==菜单，或者按下==Ctrl+Shift+D==，在菜单页面中，下拉框选择==Build & Debug Microcontroller – ST-Link==，然后点击左边的开始按键，即可通过STLink进入代码硬件调试。

::: center
![alt text](/blog_images/stm32-vscode/stlinkdebug.png)
:::

烧录和调试都需要用到STLink，如果显示STLink找不到的报错信息，可以尝试通过插件里的update STLink firmware给STLink升级，如果还是不行，那么大概率就是STLink是国产的存在兼容问题，那就转战DAPLink。

### 通过DAPLink烧录和调试

> [!tip]
> DAPLink全称是CMSIS DAPLink，所有ARM内核的单片机都能够使用的调试器，所以自然可以用来做为STM32的调试仿真器，但是！需要手动添加一点配置语句。

在确保OpenOCD下载安装，并且系统环境变量已建立并且系统已经重启过，并且利用命令行验证过可行之后

:::: steps
1. **构建OpenOCD的config文件**
   
   在工程文件夹根目录下，==文件->新建文本文件==，然后输入以下内容，并保存名为==openocd.cfg==。

   ::: code-tabs
   @tab openocd.cfg

   ```properties
   source [find interface/cmsis-dap.cfg];[!code word:cmsis-dap]
   source [find target/stm32f1x.cfg];[!code word:stm32f1x]
   reset_config none
   ```
   :::

   ::: center
   ![alt text](/blog_images/stm32-vscode/openocdcfg.png)
   :::

   **这里注意高亮的内容**
   
   第一个代表我们将使用CMSIS DAPLink调试器烧录调试，第二行代表我们要烧录调试的芯片是STM32F1系列的MCU，这两行必须根据工程所对应的单片机以及你所使用的调试器进行合适的调整！！具体OpenOCD还支持哪些调试器那些MCU，可以前往其官网查询，也可以直接到我们安装的OpenOCD软件的目录下<strong>./share/openocd/scripts/interface</strong>和<strong>./share/openocd/scripts/target</strong>查看。

   ::: center
   ![alt text](/blog_images/stm32-vscode/openocdsupport.png)
   :::

2. **添加烧录task的json配置并实现烧录**
   
   在工程目录下的<strong>./.vscode/tasks.json</strong>文件中，添加入两个DAPLink烧录任务的json配置命令，分别标签命名为==DAPLink Flash project (SWD)== 和 ==Build + Flash (DAPLINK)==。

   ::: code-tabs
   @tab tasks.json

   ```json
   {
        "type": "shell",
        "label": "DAPLink Flash project (SWD)",
        "command": "openocd",
        "args": [
            "-f",
            "${workspaceRoot}\\openocd.cfg",
            "-c",
            "init",
            "-c",
            "halt",
            "-c",
            "\"flash write_image erase ${command:cmake.launchTargetFilename}\"",
            "-c",
            "reset",
            "-c",
            "shutdown"
        ],
        "options": {
            "cwd": "${workspaceFolder}/build/${command:cmake.activeBuildPresetName}/"
        },
        "problemMatcher": []
    },
    {
        "label": "Build + Flash (DAPLINK)",
        "dependsOrder": "sequence",
        "dependsOn": [
            "CMake: clean rebuild",
            "DAPLink Flash project (SWD)",
        ],
        "problemMatcher": []
    },
   ```
   :::

   保存之后，左边侧栏切换到CMake菜单，点击==运行任务==，会出现刚刚新添加的两个任务==DAPLink Flash project (SWD)== 和 ==Build + Flash (DAPLINK)==

   ::: center
   ![alt text](/blog_images/stm32-vscode/daptask.png)
   :::

   点击即可实现通过DAPLink烧录程序，和重新生成程序并通过DAPLink烧录。

3. **构建调试launch的json配置并实现调试**
   
   在工程目录下的<strong>./.vscode/launch.json</strong>文件中，根据我所使用的芯片合适地添加“Build & Debug - DAPLink”调试选项的json配置命令

   ::: code-tabs
   @tab launch.json

   ```json
   {
        "name": "Build & Debug - DAPLink",
        "cwd": "${workspaceFolder}",
        "type": "cortex-debug",
        "executable": "${command:cmake.launchTargetPath}",
        "request": "launch",
        "servertype": "openocd",
        "device": "STM32F103ZETx", //MCU used[!code highlight]
        "configFiles": [
            "${workspaceRoot}/openocd.cfg"
        ],
        "interface": "swd",
        "serialNumber": "",        //Set DAPLink ID if you use multiple at the same time
        "runToEntryPoint": "main",
        "svdFile": "${config:STM32VSCodeExtension.cubeCLT.path}/STMicroelectronics_CMSIS_SVD/STM32F103.svd"//[!code highlight]
    },
   ```
   :::

   ::: center
   ![alt text](/blog_images/stm32-vscode/debugjson.png)
   :::

   > [!important]
   > **其中的==device==和==svdFile==项目的值一定要从原本项目自动生成的关于STLink的调试命令配置的值复制粘贴过去！**

   不同的工程项目由于开发的芯片有所不同，该两项的值也应相应做调整！而由项目自动生成的STLink的调试命令中是能保证与项目配置的芯片相匹配的！

   ::: center
   ![alt text](/blog_images/stm32-vscode/dapdebug.png)
   :::

   保存launch.json的修改之后，左侧栏的菜单切换到==运行和调试==，在下拉框中可以看到刚刚添加的==Build & Debug - DAPLink==。选择后，点击运行按钮，即可进入芯片的硬件调试。可以设置断点，查看相关变量和寄存器的值，以及所有外设的寄存器值。

   ::: center
   ![alt text](/blog_images/stm32-vscode/register.png)
   :::

::::

## 其他开发环境方案

此处仅讨论HAL库开发！由于STM32官方已经舍弃了固件库的维护，并且固件库的学习成本和使用便捷度都不尽人意，因此个人觉得，在基于简单的任务了解完STM32底层结构以及固件库的工作原理之后，就不要在固件库里钻了。因此接下来的方案，都是基于HAL开发的方案。而且现阶段以及未来，开发工具也都是为HAL服务居多，固件库注定渐渐成为历史，顶多就是满足特殊需求的备选方案。具体的信息可以参考[STM32开发环境方案](/mcu/)。
