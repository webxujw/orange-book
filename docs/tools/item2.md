---
title: item2配置
index: 2
---

item2 + oh-my-zsh + solarized配色方案

## 安装

首先我们下载的 iTem2 这个软件，比Mac自带的终端更加强大。直接官网 http://iterm2.com/ 下载并安装即可。


## 配色方案

我选用的是 [solarized](https://ethanschoonover.com/solarized/)，效果还不错。点开官网，下载，解压，然后打开 iTerm2 下的偏好设置 preference ，点开 profiles 下的colors 选项，点击右下角的 Color Presets 选项，选择import ，导入解压到的 solarized 文件下的Solarized Dark.itermcolors。


## 安装oh-my-zsh

github连接：https://github.com/robbyrussell/oh-my-zsh


使用 crul 安装：

```shell
sh -c ``"$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

或使用wget：

```shell
sh -c ``"$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```


## 主题

安装成功后，用vim打开隐藏文件 .zshrc ，修改主题为 agnoster：

`ZSH_THEME=``"agnoster"`

应用这个主题需要特殊的字体支持，否则会出现乱码情况，这时我们来配置字体：

1.使用 [Meslo](https://github.com/powerline/fonts/blob/master/Meslo%20Slashed/Meslo%20LG%20M%20Regular%20for%20Powerline.ttf) 字体，点开连接点击 view raw 下载字体。

2.安装字体到系统字体册。

3.应用字体到iTerm2下，我自己喜欢将字号设置为14px，看着舒服（iTerm -> Preferences -> Profiles -> Text -> Change Font）。

4.重新打开iTerm2窗口，这时便可以看到效果了。


## 自动提示命令


当我们输入命令时，终端会自动提示你接下来可能要输入的命令，这时按 → 便可输出这些命令，非常方便。

设置如下：

1. 克隆仓库到本地 ~/.oh-my-zsh/custom/plugins 路径下

```
cd ~/.oh-my-zsh/custom/plugins
git clone https://github.com/zsh-users/zsh-autosuggestions.git
```

2. 用 vim 打开 .zshrc 文件，找到插件设置命令，默认是 plugins=(git) ，我们把它修改为

```
plugins=(zsh-autosuggestions git)
```


3. 重新打开终端窗口。

PS：当你重新打开终端的时候可能看不到变化，可能你的字体颜色太淡了，我们把其改亮一些：

移动到 `~/.oh-my-zsh/custom/plugins/zsh-autosuggestions` 路径下

```
cd ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
```
用 vim 打开 zsh-autosuggestions.zsh 文件，修改 `ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=10'` （ fg=10 在我电脑上显示良好）。


## 语法高亮


1. 使用homebrew安装 zsh-syntax-highlighting 插件。

```
brew install zsh-syntax-highlighting
```

2. 配置.zshrc文件，插入一行。

```
source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

3. 输入命令。
```
source ~/.zshrc
```
PS：安装homebrew包管理工具：

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

*这时候打开终端窗口，你的终端看起来就和我的一样漂亮了~
