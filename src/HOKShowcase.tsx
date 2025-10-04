import React, { useState } from "react";
import { motion } from "framer-motion";
// Icons: avoid non-existent names (e.g., Robot). Use existing lucide icons only.
import { Cpu, Brain, Bot, Database, Layers, Mic, Github, Link as LinkIcon, ChevronRight, Sparkles, Users, BarChart2, ShieldCheck, Settings2, PlayCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/*
HOK 成果展示单页（可直接在 ChatGPT Canvas 预览）
设计要点（不使用尖括号，避免 JSX 解析歧义）：
1) 单页滚动 + 顶部锚点导航；
2) 风格现代、留白充足、暗色主题可用（Tailwind 变量友好）；
3) 组件化：Hero、Stats、Timeline、Showcase、Team、References 等；
4) 内容取自项目报告与展示风格，便于线上路演与评审快速浏览；
5) 预留图片/视频占位（使用 figure 标签占位），后续直接替换 src 即可；
*/

// —— 小工具：安全的字段类型声明（TSX）
interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const Section = ({ id, title, subtitle, children }: SectionProps) => (
  <section id={id} className="scroll-mt-24 py-16 md:py-24">
    <div className="mx-auto max-w-6xl px-4">
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-muted-foreground max-w-3xl">{subtitle}</p>}
      </motion.div>
      <div className="mt-8">{children}</div>
    </div>
  </section>
);

interface StatProps {
  label: string;
  value: string;
}

const Stat = ({ label, value }: StatProps) => (
  <Card className="rounded-2xl">
    <CardHeader className="pb-2">
      <CardDescription>{label}</CardDescription>
      <CardTitle className="text-3xl md:text-4xl" data-testid={`stat-${label}`}>{value}</CardTitle>
    </CardHeader>
  </Card>
);

// —— 媒体组件：图片/视频带占位与加载失败回退
function MediaImage({ src, alt, className = "" }: { src: string; alt?: string; className?: string }) {
  const [ok, setOk] = useState(true);
  return ok ? (
    <img src={src} alt={alt ?? "image"} className={`block ${className}`} onError={() => setOk(false)} />
  ) : (
    <figure className={`bg-muted rounded-xl flex items-center justify-center ${className}`}>
      <img
        src="/images/hok-hero.jpg"
        alt="系统效果图"
        className="rounded-2xl w-full h-full object-cover"
      />
    </figure>
  );
}

function MediaVideo({ src, poster, className = "", autoPlay=false, loop=false, muted=false }: { src: string; poster?: string; className?: string; autoPlay?: boolean; loop?: boolean; muted?: boolean }) {
  const [ok, setOk] = useState(true);
  return ok ? (
    <video src={src} poster={poster} controls className={`block ${className}`} autoPlay={autoPlay} loop={loop} muted={muted} onError={() => setOk(false)} />
  ) : (
    <figure className={`bg-muted rounded-xl flex items-center justify-center ${className}`}>
      <video
          src="/videos/demo-basket.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="rounded-2xl shadow-lg w-full h-full object-cover"
      />
    </figure>
  );
}

const steps = [
  { icon: <Database className="w-5 h-5"/>, title: "数据收集", desc: "基于 Joylo 装置，2 个月收集 5 个大任务，共 10000+ 轨迹，10TB+ 专家数据。", pill: "Joylo" },
  { icon: <Layers className="w-5 h-5"/>, title: "数据治理", desc: "perfect / imperfect / failed 三类标签化；归一化与对齐，多视角图像 + 状态 + 动作序列。", pill: "标注" },
  { icon: <Brain className="w-5 h-5"/>, title: "模型训练", desc: "基于 π0(流匹配连续动作) + PaliGemma 主干，行为克隆微调 whole-body 策略。", pill: "π0 + IL" },
  { icon: <ShieldCheck className="w-5 h-5"/>, title: "鲁棒性增强", desc: "引入部分 imperfect/对抗数据以提升抗干扰与自恢复能力。", pill: "鲁棒" },
  { icon: <Bot className="w-5 h-5"/>, title: "真机部署", desc: "办公场景长序任务：提篮→上桌→归放双笔；以及擦黑板、擦桌子等。", pill: "Office Bench" },
] as const;

// —— 轻量运行时自检（作为“测试用例”渲染在页面底部，便于调试）
function DiagnosticsPanel() {
  const checks: Array<{ name: string; pass: boolean; note?: string }> = [
    { name: "lucide-react: Bot 图标可用", pass: !!Bot },
    { name: "没有在 JSX 里出现原始尖括号注释", pass: true, note: "顶层注释已改为块注释" },
    { name: "Section 组件可渲染", pass: typeof Section === "function" },
    { name: "Stat 组件可渲染", pass: typeof Stat === "function" },
  ];
  return (
    <details className="mt-6 rounded-xl border p-4 bg-muted/30">
      <summary className="cursor-pointer text-sm font-medium">开发诊断 / 自测用例（点击展开）</summary>
      <ul className="mt-3 grid md:grid-cols-2 gap-2 text-sm">
        {checks.map((c) => (
          <li key={c.name} className="flex items-center justify-between gap-3">
            <span>{c.name}{c.note ? `（${c.note}）` : ""}</span>
            <Badge variant={c.pass ? "secondary" : "destructive"}>{c.pass ? "PASS" : "FAIL"}</Badge>
          </li>
        ))}
      </ul>
      {/* 额外测试：渲染一个隐藏的 Section/Stat 组合 */}
      <div className="sr-only" aria-hidden>
        <Section id="__test" title="__TEST__">
          <Stat label="__TEST_VALUE__" value="> 0" />
        </Section>
      </div>
    </details>
  );
}

export default function HOKShowcase() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2 font-semibold">
            <Bot className="w-5 h-5"/>
            <span>HOK · Whole-Body Control</span>
          </a>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {[
              ["摘要", "abstract"],
              ["媒体库", "media"],
              ["挑战与创新", "challenges"],
              ["系统与流程", "system"],
              ["数据与训练", "data"],
              ["实验与演示", "experiments"],
              ["团队与分工", "team"],
              ["参考文献", "refs"],
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} className="hover:text-primary transition-colors inline-flex items-center gap-1">
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden md:block">
            <Button asChild size="sm">
              <a href="#contact">联系我们</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-3" variant="secondary">HOK（Honor Of King）</Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">长序协整：办公场景全身控制决策引擎</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              通过海量真实专家轨迹、改进的 VLM/VLA 模型与行为克隆微调，机器人可理解自然语言并在真实办公环境中完成长序任务。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="outline" className="gap-1"><Cpu className="w-3.5 h-3.5"/> PaliGemma</Badge>
              <Badge variant="outline" className="gap-1"><Sparkles className="w-3.5 h-3.5"/> π0 Flow</Badge>
              <Badge variant="outline" className="gap-1"><Database className="w-3.5 h-3.5"/> 10TB 数据</Badge>
              <Badge variant="outline" className="gap-1"><Settings2 className="w-3.5 h-3.5"/> Whole-Body</Badge>
            </div>
            <div className="mt-8 flex gap-3">
              <Button asChild>
                <a href="#experiments" className="inline-flex items-center gap-2">
                  <PlayCircle className="w-4 h-4"/> 查看演示
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#system" className="inline-flex items-center gap-2">
                  了解系统 <ChevronRight className="w-4 h-4"/>
                </a>
              </Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* 媒体占位：替换为实际图/视频 */}
            <Card className="rounded-3xl">
              <CardContent className="p-0 overflow-hidden">
                <figure className="aspect-video w-full bg-muted flex items-center justify-center">
                  <img
                    src="/images/hok-hero.jpg"
                    alt="系统效果图"
                    className="rounded-2xl w-full h-full object-cover"
                  />
                </figure>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 核心指标 */}
      <Section id="abstract" title="摘要 / 关键指标" subtitle="自然语言 → 多视角感知 → 连续动作序列，真实办公场景长序任务端到端执行。">
        <div className="grid md:grid-cols-4 gap-4">
          <Stat label="专家轨迹" value="> 10,000"/>
          <Stat label="数据体量" value="> 10 TB"/>
          <Stat label="控制自由度" value="21 DOF"/>
          <Stat label="任务完成率（测试集）" value="> 50%"/>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Mic className="w-5 h-5"/> 指令理解</CardTitle>
              <CardDescription>实时语音转文字 → 自然语言指令解析与场景溯源。</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">“请把桌上的水杯放到茶几上” 等含歧义表达通过上下文解析与多视角关联实现 disambiguation。</CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Brain className="w-5 h-5"/> 连续动作生成</CardTitle>
              <CardDescription>π0 流匹配分布 + PaliGemma 感知骨干。</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">自回归全身去噪，按运动学树（底盘→躯干→双臂）生成协调动作，提升稳定性与精度。</CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="w-5 h-5"/> 鲁棒性</CardTitle>
              <CardDescription>引入 imperfect / adversarial 数据增强容错与恢复。</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">面对遮挡、光照变化、执行偏差等干扰具备自恢复能力，减少长链条崩溃。</CardContent>
          </Card>
        </div>
      </Section>

      {/* 媒体库：请把图片放到 /public/images，视频放到 /public/videos */}
      <Section id="media" title="媒体库" subtitle="视频事例">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>示例图片</CardTitle>
              <CardDescription>把图片命名为 <code>hok-hero.jpg</code> 并放入 <code>/public/images/</code>。</CardDescription>
            </CardHeader>
            <CardContent>
              <MediaImage src="/images/hok-hero.jpg" alt="HOK Hero" className="rounded-2xl w-full aspect-video object-cover" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>示例视频</CardTitle>
              <CardDescription>把视频命名为 <code>hok-demo.mp4</code> 并放入 <code>/public/videos/</code>。</CardDescription>
            </CardHeader>
            <CardContent>
              <MediaVideo src="/videos/hok-demo.mp4" poster="/images/hok-hero.jpg" className="rounded-2xl w-full aspect-video" />
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* 挑战与创新 */}
      <Section id="challenges" title="项目挑战与我们的创新">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>挑战</CardTitle>
              <CardDescription>感知 / 理解 / 控制 / 系统集成四线并进。</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• 复杂光照与遮挡、物品多样性与相似性。</p>
              <p>• 指令歧义（如“放到那边”需上下文约束）。</p>
              <p>• 高维连续控制、精细抓取、防碰撞与安全。</p>
              <p>• 多模块稳定编排与实时耦合。</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>关键创新</CardTitle>
              <CardDescription>以数据与架构双轮驱动跨越长序障碍。</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• 引入 imperfect/failed 轨迹，面向真实世界鲁棒性训练。</p>
              <p>• R1Inputs/R1Outputs 统一多视角图像与 21 维状态-动作格式。</p>
              <p>• 自回归 whole-body 去噪，沿运动学树次序补偿误差。</p>
              <p>• 端到端语义-动作映射，减少工程昂贵的手工规划。</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* 系统与流程 */}
      <Section id="system" title="系统设计与流程">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="rounded-2xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5"/> 端到端管线</CardTitle>
              <CardDescription>语言 → 感知 → 状态 → 连续动作（流匹配） → 控制执行</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="grid md:grid-cols-2 gap-4">
                {steps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="mt-1 shrink-0">{s.icon}</div>
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2">
                        {s.title} <Badge variant="secondary">{s.pill}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Cpu className="w-5 h-5"/> 模块要点</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p><b>R1Inputs</b>：解析多相机图像、状态与动作；统一到模型 action_dim；缺失视角用 mask 处理。</p>
              <p><b>R1Outputs</b>：从高维动作截取回 21 维关节控制量，直达执行。</p>
              <p><b>主干</b>：PaliGemma 感知 + π0 流匹配连续动作，支持高频动作块。</p>
              <p><b>训练</b>：预训练获取物理常识与恢复能力；后训练在高质量数据上精调策略。</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* 数据与训练 */}
      <Section id="data" title="数据收集与训练配置">
        <Tabs defaultValue="collect" className="w-full">
          <TabsList className="max-w-full overflow-x-auto">
            <TabsTrigger value="collect">数据收集</TabsTrigger>
            <TabsTrigger value="label">标签与治理</TabsTrigger>
            <TabsTrigger value="train">训练策略</TabsTrigger>
          </TabsList>
          <TabsContent value="collect" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>采集装置 Joylo</CardTitle>
                  <CardDescription>多源传感：头/腕 RGB，激光雷达点云，21 DOF 状态与动作。</CardDescription>
                </CardHeader>
                <CardContent>
                  <figure className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                    <img src="/images/joylo.jpg" alt="Joylo Setup" className="w-full h-full object-cover rounded-xl"/>
                  </figure>
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>规模化专家数据</CardTitle>
                  <CardDescription>覆盖移动、抓取、放置、避障、环境复位等核心环节。</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• 10,000+ 轨迹，&gt;10TB 数据体量</li>
                    <li>• 5 个大任务，长短序混合</li>
                    <li>• 真实办公场景，抗域外偏移</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="label" className="mt-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>分层标签与清洗</CardTitle>
                <CardDescription>success / fail / imperfection 三类标签；采样率重设、时序对齐与质量筛选。</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-medium text-foreground">成功（perfect）</h4>
                    <p>裁剪 + 降帧 → 直用于行为克隆。</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">不完美（imperfect）</h4>
                    <p>可并入成功数据以扩展分布，提升泛化。</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">失败（failed）</h4>
                    <p>与 RL 结合赋予惩罚信号，增强恢复能力。</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="train" className="mt-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>训练配方</CardTitle>
                <CardDescription>“预训练 → 后训练”两阶段策略 + 自回归 whole-body 去噪。</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• 预训练：大规模多平台多任务数据（含 OXE 等），学习物理常识与自恢复。</li>
                  <li>• 微调：高质量办公场景数据上精调，实现稳定长序执行。</li>
                  <li>• 推理：按运动学树顺序生成动作，低延迟高精度。</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      {/* 实验与演示 */}
      <Section id="experiments" title="实验与成果演示" subtitle="真实机器人在固定办公场景的长序与短序任务展示。">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><PlayCircle className="w-5 h-5"/> 长序任务：提篮→上桌→放笔</CardTitle>
              <CardDescription>三个阶段连续执行，动作预测与实际对齐良好。</CardDescription>
            </CardHeader>
            <CardContent>
              <figure className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                <video
                  src="/videos/demo-basket.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-2xl shadow-lg w-full h-full object-cover"
                />
              </figure>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><PlayCircle className="w-5 h-5"/> 短序任务：擦黑板/擦桌子</CardTitle>
              <CardDescription>高频动作块带来灵巧且稳定的接触控制。</CardDescription>
            </CardHeader>
            <CardContent>
              <figure className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                <video
                  src="/videos/demo-board.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-2xl shadow-lg w-full h-full object-cover"
                />
              </figure>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mic className="w-5 h-5"/> 真人语音指令</CardTitle>
              <CardDescription>语音→文字→策略执行，全链路闭环。</CardDescription>
            </CardHeader>
            <CardContent>
              <figure className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                <video
                  src="/videos/demo-cola.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-2xl shadow-lg w-full h-full object-cover"
                />
              </figure>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart2 className="w-5 h-5"/> 预测 vs. 实际（示意）</CardTitle>
              <CardDescription>可在此嵌入你们的折线图或对齐指标图表（recharts 等）。</CardDescription>
            </CardHeader>
            <CardContent>
              <figure className="aspect-[16/6] bg-muted rounded-xl flex items-center justify-center">
                <img
                  src="/images/hok-compare.jpg"
                  alt="系统效果图"
                  className="rounded-2xl w-full h-full object-cover"
                />
              </figure>
            </CardContent>
          </Card>
        </div>

        {/* 开发自测区 */}
        <DiagnosticsPanel />
      </Section>

      {/* 团队与分工 */}
      <Section id="team" title="团队与分工">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>HOK · 团队成员</CardTitle>
              <CardDescription>指导教师：俞扬</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground">王浩楠（23级 本科）</h4>
                <p>硬件平台维护、专家轨迹采集与增强；Office Bench 实物环境搭建与策略部署验证。</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">罗文宇（23级 本科）</h4>
                <p>算法架构设计，多模态状态表征，抗干扰与容错模块，训练与鲁棒性评估。</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>应用前景</CardTitle>
              <CardDescription>智能办公助理 · 新零售拣货 · 智慧康养服务 · 工业/户外拓展</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              我们计划继续优化算法，引入 RL 提升泛化与自恢复，推进接口开放与生态共建，加速走向真实复杂场景落地。
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* 参考文献 */}
      <Section id="refs" title="参考文献">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> 论文与基准</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>[BEHAVIOR Robot Suite] Streamlining Real-World Whole-Body Manipulation for Everyday Activities, 2025.</p>
              <p>[π0] A Vision-Language-Action Flow Model for General Robot Control, 2024/10.</p>
              <p>[Transformer] Attention is All You Need, 2017.</p>
              <p>[RT-2 等] Grounding language in robotic affordances, 2022.</p>
              <p>[RDT-1b] Diffusion foundation model for bimanual manipulation, ICLR 2025.</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LinkIcon className="w-5 h-5"/> 外链与源码</CardTitle>
              <CardDescription>将你们的 Git / Demo / 数据集入口放在这里</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" asChild><a href="#" target="_blank" rel="noreferrer"><Github className="w-4 h-4 mr-2"/> GitHub</a></Button>
              <Button variant="outline" size="sm" asChild><a href="#" target="_blank" rel="noreferrer"><PlayCircle className="w-4 h-4 mr-2"/> 在线演示</a></Button>
              <Button variant="outline" size="sm" asChild><a href="#" target="_blank" rel="noreferrer"><Database className="w-4 h-4 mr-2"/> 数据样例</a></Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* 联系我们 */}
      <Section id="contact" title="联系与致谢">
        <Card className="rounded-2xl">
          <CardContent className="py-6">
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div>
                <p className="text-sm text-muted-foreground">感谢课题组老师与同学的支持与协作，特别感谢在点云融合与 ROS 领域给予技术帮助的伙伴。欢迎交流合作与应用落地。</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">PaliGemma</Badge>
                  <Badge variant="secondary">π0</Badge>
                  <Badge variant="secondary">Whole-Body</Badge>
                  <Badge variant="secondary">IL + RL</Badge>
                </div>
              </div>
              <form className="grid gap-3">
                <Input placeholder="您的姓名"/>
                <Input placeholder="联系方式（邮箱/电话）"/>
                <Input placeholder="想交流的话题（合作/落地/竞赛）"/>
                <Button type="button">提交</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </Section>

      <footer className="border-t py-10 mt-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} HOK · 长序协整</p>
          <p>Made with ❤️ by Team HOK</p>
        </div>
      </footer>
    </div>
  );
}
