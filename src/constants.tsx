import { AnalysisResult } from './types';

// ============================================================================
// EXPERT MANUALLY-CURATED LEGAL DEMO RESULTS (MAPPED TO THE NEW HARD TRADE DEALS)
// ============================================================================

export const DEMO_RESULTS: Record<'id' | 'cn' | 'en', AnalysisResult> = {
  id: {
    contract_type: "国际货物买卖合同",
    contract_type_en: "International Goods Sale and Purchase Agreement",
    party_a: "Guangzhou Dingsheng Electronic Technology Co., Ltd. (Pemasok)",
    party_b: "PT Sinar Jaya Elektronik Indonesia (Importir)",
    duration: "1 Tahun, perpanjangan otomatis tanpa tinjauan kinerja",
    summary_mandarin: "针对印尼进口商 PT Sinar Jaya 采购中国广州鼎盛电子电子产品的深度审计。该合同条款存在极多单方面的高危风险：包括卖方独享的单方面无上限涨价权、极端‘现况出厂’质量免责声明、高达每周5%且每周滚算复利的滞纳罚息、仅留3天超短港口质检期限、合同终止时买方所有本地分销渠道和数据库无偿过渡给卖方、不平衡的解约期（卖方24小时，买方12个月），以及排他管辖的深圳福田法院（实为深圳南山区人民法院），使买方在维权或抗辩时面临重大危机。强烈建议重新进行法律与商务谈判。",
    summary_english: "Deep legal audit for Indonesian importer PT Sinar Jaya securing products from Chinese vendor Guangzhou Dingsheng. The agreement presents massive unilateral exposures: Supplier holds unrestrained unilateral price adjustments, an extreme 'AS-IS' warranty exclusion, severe weekly 5% late payments compounded weekly, a token 3-day terminal inspection window, zero-cost transfer of local customer networks and goodwill to the Supplier upon termination, highly asymmetric notice periods (24 hours for Supplier vs. 12 months for Buyer), and exclusive law and yurisdiction in Shenzhen Nanshan Court, RRT. Immediate renegotiation is highly recommended.",
    conclusion: "绝不能按目前的原始条款签署该重大国际购销协议。买方将直接面临不可抗的产品单方面涨价、质量严重缺陷却无法索赔、滚雪球般的复利债务、以及被卖方夺走本地商业渠道和客户网络的毁灭性风险。争端管辖在境外地方法院更意味着高昂的跨国诉讼成本。买方应坚持加入最低一年质保（RMA退换政策）、将滞纳金降至月单利1%以下、质检异议期延长至30天，并将会争议选择移交中立的SIAC新加坡国际仲裁解决。",
    risk_score: 96,
    risk_level: "HIGH",
    risk_verdict: "极度高危的单方保护契约。该合同在排除印尼法律规范的同时，将全盘贸易、资金流以及渠道的所有商业风险转嫁至印尼进口商，建议立即冻结签署并重修法务条款。",
    red_flags: [
      {
        title_cn: "卖方单方面无上限任意价格调控权 (Pasal 1)",
        original_text: "Penjual mempertahankan hak mutlak tak terbatas untuk secara sepihak (unilaterally) mengubah dan menaikkan harga unit barang dalam lembaran pesanan (PO) kapan pun.",
        translation_cn: "卖方保留随时单方面（unilaterally）更改并提高订购单（PO）中产品单价的绝对无上限权利。",
        explanation_cn: "买方向卖方发出定单并被接受后，双方在法律上已确立买卖对价。此条款给予卖方绝对 unilaterally 的涨价主权，且没有限制最高涨幅和价格确认期限，直接破坏了买方的零售成本定价基准及商业预期。",
        suggested_fix_cn: "修改为价格应在12个月内保持固定。如因芯片等核心原料成本增加需要调动，应限制年最高调整额度不超过5%，且卖方必须提早60天向买方开具正式财务审核说明，买方有权在30天内退单而无需承担赔偿。",
        law_reference: "印尼民法典 Pasal 1320 (Asas Kepantasan) & 1338 (Consensualism)"
      },
      {
        title_cn: "品质保证免责与不承担任何事故责任 (Pasal 2)",
        original_text: "Penjual secara tegas menafikan dan tidak bersedia memikul jaminan perlindungan mutu produk, baik garansi tersurat maupun implisit mengenai kelayakan dagang, circuit keselamatan, atau pemakaian fungsional di pasar domestik Indonesia.",
        translation_cn: "卖方明确否认且不承担任何产品品质保证责任，包括明示或暗示的商业可售性、电路安全性或在印尼国内市场的实际功能使用性。",
        explanation_cn: "由于电子设备关系到运行稳定性以及防自燃、防短路的安全保障，完全依照‘出厂原样/AS-IS’买卖，意味着如果该设备在印尼国内终端零售引发大规模短路、烧毁，乃至人身安全负面灾难事故，印尼进口商将全盘扛下印尼消费者消协诉讼，而无法对中国生产方行使任何追偿权。",
        suggested_fix_cn: "增加：“卖方保证所供应之全部货物具有完整的生产制造合格证，且自货物正式清关运抵买方后享有12个月质量免费质保（保证没有内部电路设计不合规或组装引发短路的事故）。若有故障，卖方须提供RMA更换或者100%退款。”",
        law_reference: "印尼消费者保护管理法 UU No. 8 Tahun 1999"
      },
      {
        title_cn: "超短3天港口异议期限及默认质量完全通过 (Pasal 2.3)",
        original_text: "Pembeli wajib melakukan pemeriksaan visual penuh atas kualitas fisik barang kontainer di pelabuhan Tanjung Priok, Jakarta paling lambat dalam waktu 3 hari kalender setelah barang dibongkar (unloading). Jika Pembeli tidak melayangkan komplain tertulis dalam kurun waktu 3 hari tersebut, barang secara mutlak dianggap dalam kondisi prima",
        translation_cn: "买方必须在雅加达 Tanjung Priok 港卸货之日起3日内进行集装箱外观全检。若未在3日内提出书面质量异议，则视为货物100%完美相符。",
        explanation_cn: "集装箱海上跨国运输通常批量巨大，在港口海关查验区3天内进行电路导通性物理查验在实操上完全不可能。况且，许多集成电路或芯片缺陷只有在最终用户拆封运行数天、甚至数周后才会显现（属于法理上的隐藏缺陷 - hidden defects）。这一条故意设限免除了买方最根本的隐藏质量异议抗辩权。",
        suggested_fix_cn: "修改为：买方应对集装箱外观在到运15个工作日内进行外观抽检，针对货物的隐藏缺陷（如电路短路、固件无法引导等）享有至少90天的深度测试和质量异议期（Cure period）。",
        law_reference: "国际商法公约 principles regarding hidden defects in sale of physical electronics"
      },
      {
        title_cn: "严重滚雪球的每周5%复利迟延滞纳金 (Pasal 3.3)",
        original_text: "will incur a penalty of 5% per week on the outstanding amount, compounded weekly... without any percentage cap.",
        translation_cn: "未付金额将产生每周5%的滞纳罚金，按周进行复利滚动计罚，不设任何比例上限封顶。",
        explanation_cn: "这是个极度暴力的利滚利高利盘剥条款。每周5%且强制周滚动复利（Compounded），复利折算年化有效利率高达惊人的1100%以上。不仅严重违背国际贸易法理中的对等诚信原则，一旦印尼购汇管制导致清算延迟数周，买方将背负极其可怕天文数字的复利高利负债。",
        suggested_fix_cn: "修改迟延滞纳金为：按单利计算，每日收取过期不付金额0.05%的滞纳金（年化约18%），且其累计罚息的总金额绝不能超过本批次货款发票总值的5%。",
        law_reference: "印尼民法典 Pasal 1338 对诚实信用原则的要求"
      },
      {
        title_cn: "非对称极端即时通知解约特权与定额绑架 (Pasal 5)",
        original_text: "Penjual memiliki wewenang penuh untuk memutuskan komitmen jual beli ini kapan saja dan secara seketika (instant termination) dalam waktu 24 jam... Sebaliknya, Pembeli dibatasi hak usahanya dan dipaksa... memberikan surat pemberitahuan tertulis minimum 12 mois ",
        translation_cn: "卖方有特权随时随时通过e-mail发函24小时后无理由（without cause）单方终止合同而无需赔偿。与之相反，买方如果要解除合同，必须提早整整12个月以正式书面公文送达进行申请。",
        explanation_cn: "严重的解约不对等。卖方可以在印尼本国旺季前夕24小时内闪电断供，导致买方渠道全面断链并面临印尼合作下游商超网点的违约追偿；而买方若因为市场崩盘或收到大量故障机器想要离港掉头，却被12个月的超长告知期死死绑定在提货 kuota 泥潭中，形同商业绑架。",
        suggested_fix_cn: "修改为对等的商业条款：“任何一方均有权出于业务便利原因解除本协议，但必须至少提前90天以挂号信实物书面公文通知另一方，以妥善交接 outstanding 订单并实现清关软着落。”",
        law_reference: "契约平等对等民法原则 (Asas Kesetaraan Hubungan Perikatan)"
      },
      {
        title_cn: "买方客户网络与数据库产权被无偿强制收缴 (Pasal 4)",
        original_text: "relasi basis pelanggan (customer database) yang dibangun oleh Pembeli menggunakan asupan modal pribadi di Indonesia, akan secara otomatis beralih menjadi hak milik tunggal Penjual secara cuma-cuma",
        translation_cn: "买方在印尼自掏大额广告营销费培育出的庞大客户购买历史资料库和分销网络，在解约后无偿划转为卖方独占所有。",
        explanation_cn: "买方出资拓展本地市场树立品牌，积累的客户名单、联系方式及交易关系是买方在印尼最核心的数字商誉、个人及商业数据资产。无偿转让等于卖方随时可以在合同第11个月时利用24小时特权解药，然后零附加成本地派遣新的利益代言人直接接管买方深耕出的全部利润大饼。",
        suggested_fix_cn: "修改为：“买方所建立的本地分销商网络、客户数据库所有权及数字客户关系，属于买方的专有商业机密与核心资产。本合同终止后，卖方不得擅自提取、使用该名单或诱导买方客户，且双方不涉及相关权利强制无偿让渡。”",
        law_reference: "印尼商业秘密保护法 UU No. 30 Tahun 2000 & 印尼个人数据保护法 (PDP) No. 27/2022"
      }
    ],
    risky_clauses: [
      { topic_cn: "单方无偿指定中国深圳法院排他审判", risk_level: "HIGH", original_text: "diselesaikan melalui Pengadilan Rakyat Distrik Nanshan, Kota Shenzhen, RRT.", translation_cn: "合同一切纠纷专属、排他由中国广东省深圳市南山区人民法院管辖审理。", explanation_cn: "将国际买卖案唯一管辖权指定在中国境内地方法庭。这使得印尼买方PT Sinar Jaya如果遇到大宗故障产品纠纷，想行使诉讼维权，必须进行昂贵的民事起诉文书中国领事公证双认证、支付高昂跨国交通宿差旅、聘请中国内地资深执业律师在深圳出庭，诉讼成本和排外壁垒足以折断买方维权的决心。" },
      { topic_cn: "排除印尼主权语言法对照失效风险", risk_level: "HIGH", original_text: "menafikan keberlakuan hukum perlindungan konsumen domestik Indonesia, termasuk persyaratan naskah bilingual dwibahasa di bawah UU No. 24/2009.", translation_cn: "明确排除印尼强制语言法的适用，拒绝提供并废止印尼文官方对照合同的法定拘束力。", explanation_cn: "直接挑战印尼第 UU 24/2009 号国别大法。印尼最高法院判例库中已有大量经典案例由于中外贸易契约在印尼本国签署（或有印尼参与方签署）未附带合规印印尼文译本，被法院直接裁定合同自始无效（Void from the beginning）。故意排除有可能将整份合同至于印尼海关及法院不予支持非法的死亡漏洞中。" },
      { topic_cn: "极低责任限额至死免除高额损害代偿", risk_level: "HIGH", original_text: "Penjual atas cacat pengiriman, kebakaran... atau kerugian finansial reputasi Pembeli di bawah kontrak ini dibatasi maksimal sebesar USD 500.", translation_cn: "卖方的最终最高累积责任赔付上限仅限定在 500 美元（USD 500）。", explanation_cn: "这是一个具有高度欺诈、不负责任的条款。如果卖方发货的适配器短路不合本地标准起火，直接把雅加达北区的集散仓库烧火导致价值几十万美元的货品全部损毁，买方居然只能从卖方处最高索赔区区500美元。这是极端且不可思议的转嫁。" },
      { topic_cn: "排他排除印尼民法典合同法定中止法定解约要件", risk_level: "MEDIUM", original_text: "Para pihak secara sadar menyingkirkan penerapan seluruh yurisdiksi sistem peradilan Indonesia", translation_cn: "双方自愿全盘放弃诉诸印尼民事法庭和民商大法的基本法律权利。", explanation_cn: "没有在终止和违约段落专门指出共同排除印尼民法典第 Pasal 1266 条的硬性保护，一旦后期买方想因为供货质量严重断裂强行单方面解约，如果该起解除案件在印尼纠缠，极易由于本法典限制而需要经由耗时的诉讼裁决方能退款，给自己套上枷锁。" },
      { topic_cn: "高息美元汇付及外汇合规刚性责任归属", risk_level: "MEDIUM", original_text: "Pembeli wajib melakukan pelunasan penuh... dalam mata uang Dollar Amerika Serikat (USD)... selambat-lambatnya 7 hari kerja sejak tanggal tagihan invoice diterbitkan.", translation_cn: "买方必须在发票开具7日内以美元完成全额国际汇款汇出。", explanation_cn: "国际电汇受印尼央行（BI）对大额离岸汇款的双重外汇洗钱合规、外资流出审查，加之中资银行对大额入账的制裁、对口合规审核。7个工作日过于局促，极易因客观流程延搁触发 weekly 5% 的复利滞纳金利息。必须延长缓冲。" }
    ],
    missing_clauses: [
      { name_cn: "最基础的RMA退货退款与故障换货（Return Merchandise Authorization）机制", name_id: "Klausul Mekanisme Retur dan Penukaran Barang Cacat (RMA)", importance_cn: "大宗电子零配件买卖如果没有详细的残次率、退换邮费、故障机器抵扣下一单货款的结算闭环，买方将不得不自掏大笔海关关税和昂贵的国际空运费去将故障品原箱寄回中国，增加巨额损耗。" },
      { name_cn: "国际贸易Incoterms 2020国际贸易术语明晰（DDP/CIF等交货点）", name_id: "Ketegasan Istilah Pengapalan Incoterms 2020 (CIF/FOB)", importance_cn: "原合同仅仅模糊说起工厂交货，货运点以及海关清关、海运保险、不可控海盗袭击毁损、集装箱港口超期滞仓费（demurrage）由谁归口全部没有明确。应当明确定为FOB广州或CIF雅加达，以免运输破损皮扯皮风险。" },
      { name_cn: "最核心的 Keadaan Kahar (不可抗力 / Force Majeure)", name_id: "Klausul Keadaan Kahar (Force Majeure)", importance_cn: "缺失这一条，如果发生红海地缘政治、中国南方台风停港、印尼大选排华谣言封港、关税大起大落等情势变更，买方仍未提货将被卡住并需被追究定额 weekly 5% 复利滞纳，是不符合法律契约常识的重大缺失。" },
      { name_cn: "中印两地中文-印尼文强制印发双语合规盖章版本", name_id: "Penyusunan Perjanjian Bilingual (Indonesia - Mandarin)", importance_cn: "必须依规准备。依据印尼 Law No. 24 of 2009 的精神，没有印尼语合规盖章的版本存在，合同极易在未来的印尼本地法庭辩护中因为违反国家语言强制主权规定被法官粗暴判定失去所有合法执权民事保护。" },
      { name_cn: "新加坡国际仲裁解决（SIAC Arbitration Center）", name_id: "Klausul Penyelesaian Sengketa di SIAC Singapura", importance_cn: "作为中立论坛。去中国提请诉讼对印尼不利，去印尼国内打官司中国也不信服。折中指定在新加坡，根据新加坡法和SIAC国际透明标准仲裁，是国际跨国商事中最受尊崇、成本和风险最为可控的方案。" }
    ],
    cultural_legal_notes: [
      "由于印尼法律框架中保护国别主权的意识极度强烈，直接将涉及在印尼境内分销零售经营的全部法律归属全部排除、完全不准备印尼文版本，会被印尼政府监管及执法法官视作对外资霸权的不当屈服，往往导致在发生大笔欠款在雅加达进行财产等值执行时面临重重阻力。",
      "由于 Pasal 1266 KUHPerdata（印尼民法典1266条）规定任何契约双边解约必须要法官在场判决定谳。中外双方为防止效率低下，会在草案中显式印制：'Para pihak dengan ini melepaskan ketentuan Pasal 1266...'（双方在此明确并自愿放弃民法典1266条的适用），这句特定法拉丁短语是完成国际贸易合同瞬间解绑必须安装的致命配角，在修改案中必放。",
      "印尼的个人数据隐私（PDP）和商业秘密保护极为重视本地商业秘密。对方强收客户名单，不仅可能违反买方已经对印尼下游商超和最终零售买家签署的一对一隐私授权告知，可能因此导致买方在印尼吃上反网络安全及数据侵权罪的监察罚单，必须予以回绝。",
      "在对中国供应商的交涉文化中，应当保持高度商业礼貌的同时极度坚持‘白纸黑字细节决定命运’。深圳及江浙供应商对商务条款极其深谙。如果口头说‘哎呀老哥，质量问题我们一定给你补，合同就按以前的深圳地方法院模板签完算球。’，一旦落笔就构成铁打法律关系，口头退换承诺在司法解释中一文不值。务必落实到附件补充签字。"
    ],
    full_translation_mandarin: `**国际货物买卖合同 (Bilingual Terjemahan Ref) / 双方买卖契约精译对照文本**

合同编号：CN-ID-SG-2025-0017
签订日期：2025年3月28日
签订地点：中国广东省深圳市南山区科技园南路10号

**卖方（供应商/甲方）：** Guangzhou Dingsheng Electronic Technology Co., Ltd.（广州鼎盛电子科技有限公司），一家依据中国法律注册并存续的实体（以下简称“卖方”）。

**买方（进口商/乙方）：** PT Sinar Jaya Elektronik Indonesia，一家依据印度尼西亚法律设立运行的合规进出口一般贸易株式会社（以下简称“买方”）。

双方经友好、自主在深圳协商一致，就本年度及后续批次电子产品离岸采购销售事宜，特达成如下单方高危条款以资遵守：

### 第一条：价格任意调整及单方价格控制权 (Klausul Hak Penyesuaian Harga Sepihak)
1. 电子产品的基本单价基于首笔大宗采购定单。然而，卖方由于不可控之半导体晶圆短缺、劳动力用工价格溢水、汇率大跌等主观商业利益调控目的，**保留单方面（unilaterally）任意更改并调高本合同一切履行中订单或新 PO 货物货款价格的绝对终身主权**。价格调整的最终幅度及折算计算公式悉数由卖方单方全权自主决定。
2. 卖方唯需通过书面电子邮件提前 **7个日历日** 向买方代表发出调价通知字样，自该封带有调价字眼的邮件送达第8日起，新增加的溢价单价在法律契约上**自动即刻生效**。
3. 买方承诺：一经签字即视为自愿、不可撤销地完全承兑并必须如期依照该新高价格全盘给付账单，买方彻底**放弃因为对于单价调高手续持有异议而宣布退单、拒绝付汇、拖延清关开信用证或要求退回定金的全部正当商业和民事抗辩权**。

### 第二条：品质免责协议与极其苛刻的雅加达港3日质检限制 (Penolakan Jaminan Mutu & Pemeriksaan 3 Hari)
1. 卖方送抵雅加达海关码头的全部电子成品及零配件，一律以在深圳/广州工厂出厂阶段的 **出厂原样/现况（As-is basis）** 交付，不承担涉及任何功能质量保障、原厂保修等法定最基础义务。
2. 卖方**明确且完整地彻底免除任何明示或暗示的、旨在保障其在印尼国内商超销售可用之电路物理安全性、无安全自燃事故、特定行业设计规范契合的品质信用责任担保**。
3. 货物海运抵达雅加达 Tanjung Priok 港卸港卸货开始之日起，买方**必须在 3 个日历天（3 Hari Kalender）内完成所有集装箱集装箱内部精密电子的功能清点和彻底质检，并向卖方投递挂号信的书面质量残次报告**。如果超过3天时间买方未提交质检残次异议执勤单，即在法律上构成买方对该批货物完美履约、零瑕疵的**绝对认可和全盘接受**。买方往后无能追索因卖方用料低下而在数月后触发的大规模电源引爆自燃、电路融化失效等无法弥补的致命质量安全灾祸，卖方对所有终端民事连带诉讼追偿享有绝对法律豁免。
4. 在任何案情判例和索偿环境下，卖方因发货重大电路质量事故连带引发买方仓储火灾毁林、声誉垮台、消费者退换赔偿等，卖方所承担的最终全部最高累计赔偿上限**死死限定在最高绝对不能超出 500美元（USD 500）** 的极低封顶数字中。买方承诺放弃向其索偿任何一分钱的连带利润损失（Consequential damage）。

### 第三条：付款期限、印尼外汇购汇流转延迟与高达每周5%复利迟延罚息 (Termin Pembayaran & Penalty 5% Compounded Weekly)
1. 买方必须在卖方将商业发票传寄之日起 **7个工作日** 内，彻底通过电汇（T/T）方法开具全额的美元（USD）无限制离岸足额结算。
2. 任何因为雅加达印度尼西亚银行（Bank Indonesia）对境外特大额美金洗钱监控审查流程滞延等行政迟滞原因，均不被卖方理会，该支付延迟对买方构成**完全的主观违约行为**。
3. 针对一切逾期未清还的利息资本款项，买方从违约首日起，必须向卖方缴纳 **每周 5% 的严重惩罚性违约逾期滞纳金（compounded weekly）**。该利息按周采用最暴力的复利循环计算，计收数额无限累加无任何cap封顶比例限制。

### 第四条：买方数字资产、推广客户数据库无偿被收割清算 (Forfeiture Database Pelanggan)
1. 双方明确，买方为了在雅加达等核心商业区建立“Dingsheng”品牌，不惜耗费其多年运营资本、投放TikTok/印尼社媒自研的本地客户销售名单（customer relationships）、本地渠道合同原案、经买方翻译并改造的印尼文设备说明版本等全部丰厚商业数字心血。
2. 在本合同不管是1年到运期满，还是中途因涉讼、不达目标而遭到提前破产，上述属于买方专有知识和数据财产利益在到期日、解约日当天，**以绝对零价格自动归入属于卖方广州鼎盛科技独占所有**。买方在3日内必须无保留交接完整的客户联系档案库、电话索引，否则须赔偿卖方高昂渠道脱节罚金。

### 第五条：非对称、闪电24小时与超长12个月的合同告知期限 (Pemutusan Sepihak Timpang)
1. 卖方仅仅由于全球配额调动等纯粹的“行政便利”或自我主观需求，**即有特权通过发送电子邮件提早 24小时 宣布整份购销框架不附加条件作废**，且不承担买方下游商超追付的任何解约金赔付。
2. 倘因特殊原因，买方希望主动请求提前离开本采购地狱，买方必须**提早整整 12个月 之前** 递送实物公章挂号信进行正式解约申请。这12个月告知缓冲内，买家即使在雅加达本地一分钱货物都卖不出，**由于一笔PO已经被录入生产线，买家仍然必须咬牙全额接收并付款，拖延直接扣罚并计算 compounding weekly 5% 的利滚利盘扣**。

### 第六条：中国深圳法院绝对排他主权司法管辖 (Yurisdiksi Pengadilan Nanshan, Shenzhen)
1. 本合同在所有环节上全盘排他适用中华人民共和国大陆民商法，排除印尼消费者权利保护等公序良俗法则。
2. 双方明确、完全排除印尼 UU No. 24/2009 对于国际外贸文本强制双语对照的规定，买方在知情下全盘自愿放弃印尼语本合同效力，即使因此在雅加达最高院打官司被判定自始不符由于中英对照缺失而导致虚幻，亦属于买方自身疏怠过失所致，买方不因该政策漏洞提出辩白。
3. 所有因本协议纠纷发起的任何形式起诉，必须只能诉诸并且去往 **中国广东省深圳市南山区人民法院** 诉起官司，拒绝向雅加达民事法庭等有权机构起诉。买单单方面背负在深圳进行的起诉、律师函、法庭认证纸、全套宣誓双认证翻译费，且不能对该境外管辖权提起任何地方法律不当异议反诉。

代表签字盖章授权（卖方 Guangzhou Dingsheng 盖红章）：张伟宏 _________________
代表签字盖章授权（买方 PT Sinar Jaya 按并印尼公章）：Budi Santoso _________________`
  },
  cn: {
    contract_type: "国际货物买卖合同",
    contract_type_en: "International Goods Sale and Purchase Agreement",
    party_a: "广州鼎盛电子科技有限公司 (卖方)",
    party_b: "PT Sinar Jaya Elektronik Indonesia (买方)",
    duration: "12个月，期满后本购销合同以及约束条款自动续展1年，循环往复",
    summary_mandarin: "一份针对进出口双方签署的《国际货物卖买合同》的极限审计报告。这是一份典型倾斜于中国供应商（甲方）利益的霸王协议模板，买方的商业和法律维权空间被全盘封杀，尤其体现在允许甲方单方面提早7天通知即不限涨幅地随意调价、对电路等电器设计实行免责抛售（As-is base，否认所有质量及自燃连带事故保修）、仅留雅加达港卸任3天极速完成深度质检、惊人的每周5%复利滞纳金罚息，且强收买方大额广告拓展在印尼本地产出的客户档案、非对称即时解约、并全盘排除印尼消费者法规刚性适用，把官司卡死在中国广东省深圳市南山区法院管辖，对PT Sinar Jaya是彻底的法律毒丸（Legal Poison Pill）协议，强烈建议拒绝直接签署。",
    summary_english: "Extreme legal audit report on the International Goods Sale and Purchase Agreement. This serves as a classic textbook example of an highly unbalanced, buyer-toxic contract designed entirely for the benefit of Guangzhou Dingsheng (Seller). It disarms PT Sinar Jaya (Buyer) through extreme unilateral rights: Seller holds absolute unilateral pricing control with a rapid 7-day email trigger, full 'AS-IS' warranty waiver excluding fire or structural defects, an impossible 3-day terminal inspection timeline, astronomical late payments of compound weekly 5%, forfeit of local client database to the Seller, and exclusive law and yurisdiction centered in Shenzhen Nanshan Court, China. Uncertified to be signed.",
    conclusion: "绝不能容忍如此极端不对等的国际购销陷阱。买方应当迅速回函供应商，强力启动条款重修程序：首先，要求设立一整年保价承诺，调价额度设最高封顶且买方享有解除合约反悔权；其次，强制增设12个月整机最低电气质量保证与RMA残次换抵扣机制；第三，在雅加达港收货时必须争得14个工作日的常规首检时间，对电路等隐藏漏洞（hidden defects）享有90天追责权；第四，滞纳处罚需严格限制降低至年均单利15%以下；第五，也是最重要的，管辖法院必须迁往SIAC新加坡国际仲裁中心等双边中立高信誉平台，不接受任何深圳法院的单一排他属港。",
    risk_score: 95,
    risk_level: "HIGH",
    risk_verdict: "极度偏袒卖方利益的‘商务地狱契约’。不留任何商业缓冲期和质量补救救济手段，在财务和跨国官司领域设下高额壁垒，建议重签框架补充案。",
    red_flags: [
      {
        title_cn: "卖方随时 unilateral（单方面）不限比例调动高价 (Pasal 1)",
        original_text: "由于芯片等原材料涨价、国际汇率剧烈波动及用工成本上涨等不可控因素，卖方保留随时 unilaterally（单方面）调整、提高本协议及任何未履行订单中货物单价的至高权利",
        translation_cn: "Seller reserves the absolute unilateral right (unilaterally) to adjust, increase or modify unit prices of outstanding or incoming purchasing orders.",
        explanation_cn: "商业交易最底线的基础即是‘价格恒定契约性’。该款直接单方面颠覆性放权给供货企业，允许其因自身产能或主观利润需求在任何未履行的订单中突袭提价，直接令买方在印尼本国陷入高价定煤、面临亏本甚至下游起诉破产绝境。",
        suggested_fix_cn: "修改为：‘货物价格确定后，应在首次发货12个月内严格锁死。任何后续由于大范围市场芯片大涨而引发的价格升幅调整，必须由买卖双方代表友好书面协议并一致盖章，且调增幅单次不得超过原有交易标的5%，并最少提前60日寄送印尼进口商书面确认。’",
        law_reference: "中华人民共和国民法典第470条以及印尼民法典1338对自愿平等的底线规范"
      },
      {
        title_cn: "‘出厂现状’免予承保大宗短板电器火灾缺陷 (Pasal 2)",
        original_text: "所有产品交付买方时，以国际最简易“出厂现状”为准（AS-IS basis，即现况交货、不附任何产品缺陷质保担保）。",
        translation_cn: "All goods supplied are delivered on an 'AS-IS' (current status) basis, completely disclaiming any structural or electric warnings or warranties.",
        explanation_cn: "大批量供货芯片、数码充电口、大容量电池等电子器材如果以 As-Is（现状现况抛售）交易，不仅违反国际贸易基本法理，更有意设下产品自燃、重大电容短路的质检绝缘安全绝缘防火雷区。若发生了因生产时焊锡串联故障所引起的大案，买方索偿权直接为零。",
        suggested_fix_cn: "修改为：‘卖方保证其产品具备完整中国国家质量3C认可及中印海运海事清关检验，自买方在雅加达到货卸港卸载之日起享有 1 年保修服务维护。卖方对其由于内部制造或电路板组装缺陷导致的所有安全和起火事故承担全部原厂保证。’",
        law_reference: "印尼消协管理法 UU No. 8/1999 印尼第82条、中华人民共和国产品质量法"
      },
      {
        title_cn: "仅仅给出海运3天完成集装箱实机精密测试周期 (Pasal 2.3)",
        original_text: "买方收货后，必须在货物运抵印尼雅加达港口卸货之日起3日内，完成外观全检并向卖方提出书面质量异议。如果超出此3日时限买方未书面异议，即视为所交货物质量100%合格",
        translation_cn: "Buyer must perform full physical inspection and submit a formal written claim within 3 calendar days of unloading at Jakarta port.",
        explanation_cn: "集装箱离岸上岸、拖柜开集、商检清查到货物拉回印尼进口商本地主仓库，在雅加达通常需要5-10天周期。3天的查验异议期限（还不是工作日，由于印尼本地各种节假可能未到仓即到期）是人为地恶意切断索赔流程，故意剥夺对电学、电池老化和主板控制晶片功能等深层‘隐藏质量病害’提出索赔补足的民事诉讼权利。",
        suggested_fix_cn: "修改为：‘买方对集装箱表层外观的数量异议期为货物卸港送至买方自建大仓起算的 15 个工作日；至于系统主板、发热短流自燃以及隐蔽芯片逻辑等非肉眼可见的“隐藏质量瑕疵”，买方专享至少 90 天的可行追责退换保证期。’",
        law_reference: "Sale of Goods Act regulations relating to local inspection timelines"
      },
      {
        title_cn: "疯狂到令人发指的复利高利每周利滚利高达5%罚金 (Pasal 3.3)",
        original_text: "买方必须向卖方承付每周5%（5% compounded weekly）的累进逾期迟延罚金。该迟延金以周为单位，实施最严厉的周滚动复利计息",
        translation_cn: "Outstanding principal incurs a weekly late payment penalty of 5%, compounded weekly... with no limit or cap.",
        explanation_cn: "周息5%且按周‘大滚存复利’，由于利息生利息、利滚息，折合折算年化真实罚金总额高企为超出常规天文数字的1000%利滚利，属于典型掠夺欺诈。一旦买方因为中印外汇清算、银监合规、印尼换汇延迟不慎晚付1个月，就会白白背上本金近25%的高额惩罚性高利息。极易导致买方由于一次偶发银行网络故障而连带性面临跨国司法清盘破产负债。",
        suggested_fix_cn: "修改为：‘若买方有大额到期款逾期，应当在3个工作缓冲工作日（Grace period）后以未结款之每日万分之四（单利计算，不累加）承担未退款罚息，且累计迟延利息罚金总计最高上限限定在不得超过本提PO单项总货款价格的5%。’",
        law_reference: "印尼民法典 1338 诚信诚实契约底线，最高法关于利息合理比例司法约束判例"
      },
      {
        title_cn: "将买方自掏营销推广资本建立的印尼分销客户库强制归零划转 (Pasal 4)",
        original_text: "在本合同因任何原因终止或期满之日，上述所有在印尼渠道沉淀、客户网络和推广版权利益，均以零价格（零对价）自动、完整移转归属于卖方独占所有",
        translation_cn: "Upon termination of this Agreement for any reason, all client registries, customer networks and digital media adaptation records built by Buyer shall transfer to Seller at zero cost.",
        explanation_cn: "买方花费大量印尼本地推广广告费建立起的庞大印尼电子分销、二级经销商合作群以及用户数据联系信息等隐性资产（Data goodwill），不仅具有财产及数字资产法律主权，更能转化成下一份贸易的利润基石。一旦直接约定零对价比无偿侵吞，卖方可以随时提前不合作、收缴买方苦苦做下的全部新零售江山，对中印商贸规则是非常严重的企业自杀条款。",
        suggested_fix_cn: "修改为：‘因终止合伙原因造成解除，买方在印尼运营树立的所有渠道分销经销商网络关系、二级采购数据以及自有客服管理数据库（Client CRM）的所有版权资产，无保留并且专属归买方独立保存。卖方不得擅自干涉、窃取或指使他人复制使用买方在当地的数据库。’",
        law_reference: "印尼个人数据隐私保护法 (PDP Law No. 27/2022)"
      }
    ],
    risky_clauses: [
      { topic_cn: "24小时电邮通知终止排他保护机制", risk_level: "HIGH", original_text: "卖方可随时出于业务便利之主观原因...发出书面解约通知，在发出通知24小时后提前即时终止本协议... 反之买方须提前整整12个月发挂号信方可提出辞本", translation_cn: "Seller may terminate in 24 hours via email; Buyer requires a 12-month registered notice.", explanation_cn: "非对称解约告知设定。卖方可以任性无损失瞬间停供，让买方在印尼面临客户大量取消定单并被消协高额索赔。而买方即便面临破产风暴，依然被12个月的采购绑死，严重摧毁商业自由底线。" },
      { topic_cn: "一票否决印尼民事赔偿完全管辖", risk_level: "HIGH", original_text: "本协议的一切纠纷应提交至中国广东省深圳市南山区人民法院管辖起诉，买方彻底排除向印尼本地民事诉讼法庭请求、起诉或异地执行...", translation_cn: "Disputes exclusively submitted to Shenzhen Nanshan District Court, China; Buyer waives any right to sue in Indonesia.", explanation_cn: "深圳南山法庭虽然高效卓越，但要求印尼进口商为了质量纠纷跨国诉打官司，所付出的海运认证、使领馆双认证公证书、深圳专职海事律师每小时律师费均会成千上万美元。让弱小进口商事实上无法求偿。" },
      { topic_cn: "完全除开印尼双语强制使用法效力", risk_level: "HIGH", original_text: "完全、彻底地排除印尼现行任何强制性法律（包括关于合同必须设立印尼对照文本...）", translation_cn: "Expressly excluding all mandatory Indonesian regulations including bilingual contract Law No. 24/2009.", explanation_cn: "印尼UU 24/2009号法律为强制性法律，若发生争议，印尼本土法院会以此为由认为由于缺乏合法印尼文版本对等签署，合同不符合公共政策秩序，从而判决整份英文/中文版本丧失全部诉讼约束权。排除它并不能逃脱该法对资产扣押案的第一审查作用。" },
      { topic_cn: "空前有限赔偿上限 500 美元包容大灾", risk_level: "HIGH", original_text: "卖方对买方就任何批次产品不良（包含因产品缺陷导致的火灾、人身安全事故等）...最高绝对不超过500美元", translation_cn: "Seller's cumulative liability for defects, fire, damages and safety issues is strictly capped at USD 500.", explanation_cn: "将所有电路故障引燃自燃等涉及万千美金的侵权公设大难赔付，极限定封口在无意义的500美元（约折合700万盾）。是对产品安全缺陷导致财产毁灭时责任转嫁的不合法条款。" },
      { topic_cn: "无考核自动强制延续加期1年设定", risk_level: "MEDIUM", original_text: "本合同效力及一切不平衡约束机制将自动每次重新延续加时1年，循环往复。即使买方在当年出现大额滞销...", translation_cn: "Contract automatically extends for 1 year recursively even if Buyer experiences heavy stagnant inventory.", explanation_cn: "失去在期满后借业绩萎缩理由平稳退出合作通道之权利，被迫长期忍受卖方强势控货、高罚息的财务锁链锁定，应当建立对等审核。" }
    ],
    missing_clauses: [
      { name_cn: "国际贸易Incoterms 2020（交货责任风险点划分）", name_id: "Ketegasan Incoterms 2020 (Titik Tanggung Jawab Kerusakan)", importance_cn: "合同内未写明究竟是买方出厂自提（FOB运费倒付）还是卖方报清关离岸（CIF雅加达）。一旦海运由于台风倾覆、集装箱压箱港口等出现巨额超期 demurrage 港杂开销，中印双方将面临旷日持久的责任皮大战。" },
      { name_cn: "强制RMA电子残次率分批折扣报免与原件核实注销条款", name_id: "Klausul Kebijakan RMA dan Diskon Penggantian Barang Rusak", importance_cn: "中大批量电子批发，工厂必然伴随大千分之几、甚至百分之几的基础残次绿。如果没有 RMA 双边折旧或直接在下月 PO 中抵扣 1.5% 货款的常规‘技术容损抵扣机制’，买方将承担全额故障坏件折旧。" },
      { name_cn: "强制本国语对照版本双语并存及强制印尼文签名", name_id: "Bilingual Contract Requirements under Law No. 24/2009", importance_cn: "印尼本土法规不可凌驾，强制安装印尼版本。没有该版本不仅在清关、stp商业代理证注册时遭遇工商卡塞，而且如果需要在雅加达申请财产诉前保全，海关和地方法警对纯中/英文合同文件看都不看直接无视或借故驳回。" },
      { name_cn: "中立第 3 国 SIAC 新加坡国际争议解决机制", name_id: "Penyelesaian Sengketa di SIAC Singapura", importance_cn: "强烈推荐。深圳福田法院或南山地方法院由于其完全处于境外，且在印尼判例史上极难执行境外判决，用 SIAC 能够获得国际纽约公约160个国家间（包括中国同印尼）双向民事财务裁决定谳，在印尼当地也能迅速无摩擦执行资产抵顶清盘。是跨国商业的最佳金线管辖。" }
    ],
    cultural_legal_notes: [
      "中方华南地区供应商在电子数码组装业务中非常习惯于使用‘深圳精简版出货模板’。他们为追逐高速出单、低利润率，往往会最大化地卸掉哪怕由于电容老化和电路短路等本应由于生产装配引起的重大安全侵权质保。印尼进口商由于缺少中文法律意识，千万不能在‘哎呀大家在深圳喝过茶，我们关系这么好，合同只是个过场，我们口头给你大包干保修’这种借口下糊涂签字，必须白纸黑字入册。",
      "由于印尼 Law No 24 / 2009 属于主权宪法强制类法规，在印尼司法框架内是无法被合同白纸黑字‘我们自愿排除它’就能实现无视的。印尼地方法庭（Pengadilan Negeri）法官通常极偏袒本土雇主或者本土分销商，一旦该合同无印尼文直接在雅加达最高院打成涉诉，对方往往不费吹灰吹掉此合同对印尼资产的一切法律执行约束权，应当小心行事。",
      "关于对于5% weekly 极其恶性的周滚动利息盘剥，在印尼乃至国际契约法上，被称为‘Lesion’或者‘Usury’（暴利高利贷利息）。印尼法官经常会行使法官酌情削减干预权（Pasal 1338 KUHPerdata Assas Kepatutan），将此类不合民俗契约、有损商业常理的多倍复利强制剪裁裁降至标准年单利6%-10%左右。买方应以此法典原则与中国卖方强势据理力争：复利高利根本不合法，必须更换为年单利。"
    ],
    full_translation_mandarin: `**国际货物买卖合同 (Bilingual Terjemahan Ref) / 双方买卖契约精译对照文本**

合同编号：CN-ID-SG-2025-0017
签订日期：2025年3月28日
签订地点：中国广东省深圳市南山区科技园南路10号

**卖方（供应商/甲方）：** Guangzhou Dingsheng Electronic Technology Co., Ltd.（广州鼎盛电子科技有限公司），一家依据中国法律注册并存续的实体（以下简称“卖方”）。

**买方（进口商/乙方）：** PT Sinar Jaya Elektronik Indonesia，一家依据印度尼西亚法律设立运行的合规进出口一般贸易株式会社（以下简称“买方”）。

双方经友好、自主在深圳协商一致，就本年度及后续批次电子产品离岸采购销售事宜，特达成如下单方高危条款以资遵守：

### 第一条：价格任意调整及单方价格控制权 (Klausul Hak Penyesuaian Harga Sepihak)
1. 电子产品的基本单价基于首笔大宗采购定单。然而，卖方由于不可控之半导体晶圆短缺、劳动力用工价格溢水、汇率大跌等主观商业利益调控目的，**保留单方面（unilaterally）任意更改并调高本合同一切履行中订单或新 PO 货物货款价格的绝对终身主权**。价格调整的最终幅度及折算计算公式悉数由卖方单方全权自主决定。
2. 卖方唯需通过书面电子邮件提前 **7个日历日** 向买方代表发出调价通知字样，自该封带有调价字眼的邮件送达第8日起，新增加的溢价单价在法律契约上**自动即刻生效**。
3. 买方承诺：一经签字即视为自愿、不可撤销地完全承兑并必须如期依照该新高价格全盘给付账单，买方彻底**放弃因为对于单价调高手续持有异议而宣布退单、拒绝付汇、拖延清关开信用证或要求退回定金的全部正当商业和民事抗辩权**。

### 第二条：品质免责协议与极其苛刻的雅加达港3日质检限制 (Penolakan Jaminan Mutu & Pemeriksaan 3 Hari)
1. 卖方送抵雅加达海关码头的全部电子成品及零配件，一律以在深圳/广州工厂出厂阶段的 **出厂原样/现况（As-is basis）** 交付，不承担涉及任何功能质量保障、原厂保修等法定最基础义务。
2. 卖方**明确且完整地彻底免除任何明示或暗示的、旨在保障其在印尼国内商超销售可用之电路物理安全性、无安全自燃事故、特定行业设计规范契合的品质信用责任担保**。
3. 货物海运抵达雅加达 Tanjung Priok 港卸港卸货开始之日起，买方**必须在 3 个日历天（3 Hari Kalender）内完成所有集装箱集装箱内部精密电子的功能清点和彻底质检，并向卖方投递挂号信的书面质量残次报告**。如果超过3天时间买方未提交质检残次异议执勤单，即在法律上构成买方对该批货物完美履约、零瑕疵的**绝对认可和全盘接受**。买方往后无能追索因卖方用料低下而在数月后触发的大规模电源引爆自燃、电路融化失效等无法弥补的致命质量安全灾祸，卖方对所有终端民事连带诉讼追偿享有绝对法律豁免。
4. 在任何案情判例和索偿环境下，卖方因发货重大电路质量事故连带引发买方仓储火灾毁林、声誉垮台、消费者退换赔偿等，卖方所承担的最终全部最高累计赔偿上限**死死限定在最高绝对不能超出 500美元（USD 500）** 的极低封顶数字中。买方承诺放弃向其索偿任何一分钱的连带利润损失（Consequential damage）。

### 第三条：付款期限、印尼外汇购汇流转延迟与高达每周5%复利迟延罚息 (Termin Pembayaran & Penalty 5% Compounded Weekly)
1. 买方必须在卖方将商业发票传寄之日起 **7个工作日** 内，彻底通过电汇（T/T）方法开具全额的美元（USD）无限制离岸足额结算。
2. 任何因为雅加达印度尼西亚银行（Bank Indonesia）对境外特大额美金洗钱监控审查流程滞延等行政迟滞原因，均不被卖方理会，该支付延迟对买方构成**完全的主观违约行为**。
3. 针对一切逾期未清还的利息资本款项，买方从违约首日起，必须向卖方缴纳 **每周 5% 的严重惩罚性违约逾期滞纳金（compounded weekly）**。该利息按周采用最暴力的复利循环计算，计收数额无限累加无任何cap封顶比例限制。

### 第四条：买方数字资产、推广客户数据库无偿被收割清算 (Forfeiture Database Pelanggan)
1. 双方明确，买方为了在雅加达等核心商业区建立“Dingsheng”品牌，不惜耗费其多年运营资本、投放TikTok/印尼社媒自研 of 本地客户销售名单（customer relationships）、本地渠道合同原案、经买方翻译并改造的印尼文设备说明版本等全部丰厚商业数字心血。
2. 在本合同不管是1年到运期满，还是中途因涉讼、不达目标而遭到提前破产，上述属于买方专有知识和数据财产利益在到期日、解约日当天，**以绝对零价格自动归入属于卖方广州鼎盛科技独占所有**。买方在3日内必须无保留交接完整的客户联系档案库、电话索引，否则须赔偿卖方高昂渠道脱节罚金。

### 第五条：非对称、闪电24小时与超长12个月的合同告知期限 (Pemutusan Sepihak Timpang)
1. 卖方仅仅由于全球配额调动等纯粹的“行政便利”或自我主观需求，**即有特权通过发送电子邮件提早 24小时 宣布整份购销框架不附加条件作废**，且不承担买方下游商超追付的任何解约金赔付。
2. 倘因特殊原因，买方希望主动请求提前离开本采购地狱，买方必须**提早整整 12个月 之前** 递送实物公章挂号信进行正式解约申请。这12个月告知缓冲内，买家即使在雅加达本地一分钱货物都卖不出，**由于一笔PO已经被录入生产线，买家仍然必须咬牙全额接收并付款，拖延直接扣罚并计算 compounding weekly 5% 的利滚利盘扣**。

### 第六条：中国深圳法院绝对排他主权司法管辖 (Yurisdiksi Pengadilan Nanshan, Shenzhen)
1. 本合同在所有环节上全盘排他适用中华人民共和国大陆民商法，排除印尼消费者权利保护等公序良俗法则。
2. 双方明确、完全排除印尼 UU No. 24/2009 对于国际外贸文本强制双语对照的规定，买方在知情下全盘自愿放弃印尼语本合同效力，即使因此在雅加达最高院打官司被判定自始不符由于中英对照缺失而导致虚幻，亦属于买方自身疏怠过失所致，买方不因该政策漏洞提出辩白。
3. 所有因本协议纠纷发起的任何形式起诉，必须只能诉诸并且去往 **中国广东省深圳市南山区人民法院** 诉起官司，拒绝向雅加达民事法庭等有权机构起诉。买单单方面背负在深圳进行的起诉、律师函、法庭认证纸、全套宣誓双认证翻译费，且不能对该境外管辖权提起任何地方法律不当异议反诉。

代表签字盖章授权（卖方 Guangzhou Dingsheng 盖红章）：张伟宏 _________________
代表签字盖章授权（买方 PT Sinar Jaya 按并印尼公章）：Budi Santoso _________________`
  },
  en: {
    contract_type: "International Goods Purchase and Sale Agreement",
    contract_type_en: "International Goods Purchase and Sale Agreement",
    party_a: "Guangzhou Dingsheng Electronic Technology Co., Ltd. (Supplier)",
    party_b: "PT Sinar Jaya Elektronik Indonesia (Importer)",
    duration: "1 Year, automatic renewal continuously for 1-year terms recursively",
    summary_mandarin: "针对带有国际贸易双边进出口纠纷典型的《国际货物定购买卖合同》的法律深度评估报告。本合约内容严重失衡，极其危险。广州鼎盛（供货方）被赋予了单方面、突发性提前7天电子邮件改单价的绝对自主权，且彻底排除了设备和微电路产品质量的残次质保与设备火灾自燃侵权责任；规定了高达每星期 5% 且带有 weekly 滚存复息（compounded）的灾难性滞纳惩金罚息；另外还在合同期满或解约离港后，无偿没收买方PT Sinar Jaya出资在印尼开发、积累的经销商渠道数据库所有数据所有权。合约解约告知极为不对位（卖方提早24小时即可，买家必须熬12个月），其纠纷解决唯一的管辖权地选在深圳法院，完全架空排除印尼本国双语和消协法定防护。强烈建议阻断签字，重设草案。",
    summary_english: "Deep legal audit report on the International Goods Purchase and Sale Agreement. The contract represents an extremely critical risk exposure for the importer, PT Sinar Jaya (Buyer). It grants Guangzhou Dingsheng (Seller) highly biased and unilateral rights, notably: unrestrained pricing rights with an ultra-short 7-day prior notice, total negation of warranties and product liability for electrical hazards under an 'AS-IS' clause, extreme compound late penalties of 5% weekly, forfeiture of the local Indonesian dealer database upon termination, highly disproportionate notice options (24 hours for Seller vs. 12 months for Buyer), and exclusive jurisdiction restricted to Shenzhen Nanshan Court, China, completely disabling mandatory Indonesian consumer protecs. Immediate revision is necessary.",
    conclusion: "PT Sinar Jaya must strictly reject this terms structure. It binds the buyer in deep commercial and debt commitments with zero reciprocal protections regarding pricing stability, hidden product defects, or database asset retention. If a large-scale hardware ignition hazard manifests in Indonesia, the cumulative financial and consumer liabilities will fall entirely on the importer, while any recourse is locked in a foreign court. Insist on transforming the foreign court to SIAC, dropping the compound rate to a standard annual rate, extending the terminal check time to 15 days, and establishing a real RMA quality warranty sheet.",
    risk_score: 95,
    risk_level: "HIGH",
    risk_verdict: "An extremely aggressive, highly tilted international sales agreement that shifts all manufacturing cost-overhead, liability risks, and interest penalties to the Buyer, while retaining the right to seize the Buyer's local commercial networks.",
    red_flags: [
      {
        title_cn: "卖方单方面对未履行及后续PO单价自由变动 (Article 1)",
        original_text: "the Seller reserves the absolute, unilateral right (unilaterally) to adjust, increase, or modify the unit price of any product in outstanding or incoming commercial orders at any time.",
        translation_cn: "卖方保留随时单方面（unilaterally）调高、更改任何未交货PO单价的绝对极高特权。",
        explanation_cn: "By eliminating price stability, the Seller can force the Buyer to accept massive price shocks midway through shipping logs. Since there is no 'cap' or exit opt-out for the Importer, the Buyer must buy the goods at any inflated price, bypassing commercial safety.",
        suggested_fix_cn: "Add a firm 12-month pricing lock. Any upward cost adjustments must require mutual written agreement, be supported by authentic raw materials records, capped at 5% annually, and allow the Buyer 30 days to cancel any pending order without fee.",
        law_reference: "Consensualism & Fairness limits in global contractual trade (Pasal 1338 KUHPerdata)"
      },
      {
        title_cn: "‘出厂现装现存AS-IS’彻底除外最微件电路品质事故 (Article 2)",
        original_text: "All electronic components... are supplied on a strict 'AS-IS' basis at the port of departure... Seller explicitly disclaims all statutory and common-law warranties, express or implied",
        translation_cn: "所有销售设备和微电脑控制元件均以离港口最简易‘出厂现况’现况买卖。卖方声明放弃承担涉及一切法定商售质保及电路抗事故质保责任。",
        explanation_cn: "This clause shifts 100% of the manufacturing and hardware assembly risks to the Buyer. If an uncertified batch of adapters or batteries experiences internal failure or explodes and triggers local warehouse structures, PT Sinar Jaya will handle consumer suits alone while the original Chinese manufacturer remains immune.",
        suggested_fix_cn: "Replace with: 'Seller guarantees and warrants that all supplied goods are free from latent engineering, firmware, and assembly defects for 12 months from the date of custom release, and Seller shall indemnify Buyer for any safety damage originating from latent manufacturing faults.'",
        law_reference: "Indonesian Mandatory Consumer Rights Protection Act UU No. 8/1999"
      },
      {
        title_cn: "卸载3日内物理测试完结异议限时 (Article 2.3)",
        original_text: "complete visual and functional inspection... within 3 calendar days of offloading... Failure to raise written complaints within 3 days translates to full and absolute acceptance",
        translation_cn: "买卖必须在卸货抵达雅加达港口 3 个日历日內通过外观和内部全面质控。3天内未提起正式书面诉由视为100%完全无残次合格签收。",
        explanation_cn: "This establishes a practical impossibility. Custom clearances, transport to the warehouse, and unboxing bulk electronics usually require at least 10–14 days. This clause is a bad-faith trap designed to erase the Buyer's legal ability to claim compensation for latent defects (which only reveal themselves upon usage).",
        suggested_fix_cn: "Change custom arrival review window to 15 standard business days for general appearance discrepancies, and a 90-day comprehensive test and testing window for latent motherboard and component performance issues.",
        law_reference: "Latent Defects doctrine in Civil and Commercial Sales Law"
      },
      {
        title_cn: "恶劣每周 5% 带有周滚存复金的逾期高利罚单 (Article 3.3)",
        original_text: "overdue principal amounts shall accumulate a weekly late penalty of five percent (5%), compounded weekly. This penalty will accrue compounding interest recursively without any percentage cap",
        translation_cn: "逾期的货款主本应按照每周百分之五（5%）累加复利滞纳金。罚款按星期实施最暴力的滚动式本滚利复存计收不设限。",
        explanation_cn: "An interest penalty of 5% weekly with compounding interest translates to an astronomical effective rate of over 1100% annually! It constitutes usury. A minor central back forex delay or standard public holiday bank closing will quickly pile up into catastrophic compound debts capable of liquidating the Buyer's business model.",
        suggested_fix_cn: "Change the penalty to simple interest at 0.05% per day (approximately 18% simple annual rate), with the total accumulated penalty capped at a maximum of 5% of the delayed invoice value.",
        law_reference: "Good faith in contract performance & public policy on interest caps"
      },
      {
        title_cn: "买方自费拓展的二级渠道和零售数据库在解约后无偿过渡 (Article 4)",
        original_text: "customer databases... developed by the Buyer... shall automatically transfer, at zero cost... to the sole and exclusive ownership of the Seller upon termination.",
        translation_cn: "买方出资并在印尼市场深层耕出的分销、客户姓名网络及采购记录。在解约或终止后无代价自动充公归卖方绝对所有。",
        explanation_cn: "Your local customer relationship database is your most crucial intangible asset. Allowing the Supplier to seize this asset for free enables them to easily terminate your agreement on a whim and hand over your ready-made customer network to a cheaper local proxy, rendering your years of investment utterly worthless.",
        suggested_fix_cn: "Amend to: 'All localized distributors databases, retail networks, and client transaction logs compiled by the Buyer inside Indonesia during the cooperation shall remain the exclusive property of the Buyer. Seller shall have no right to collect, request, or clone such digital databases.'",
        law_reference: "Indonesian Law on Trade Secrets No. 30/2000 & Personal Data Protection (PDP) No. 27/2022"
      }
    ],
    risky_clauses: [
      { topic_cn: "中国深圳福田法院专属民事管辖", risk_level: "HIGH", original_text: "resolved exclusively by the People's Court of Nanshan District, Shenzhen City, PRC. ", translation_cn: "所有的纠纷只应并专属由中国深圳南山区法地方法院管辖起诉。", explanation_cn: "Forcing an Indonesian business to initiate expensive legal procedures in Shenzhen Nanshan District for quality disputes is a massive barrier. International notary notarization, embassy translations, and Chinese litigator hourly fees make legal recourse economically self-defeating for the Buyer." },
      { topic_cn: "完全排除印尼本地双语合同签名和法律效用", risk_level: "HIGH", original_text: "expressly exclude the application of Indonesian Consumer Law, bilingual translation enforceability under Law No. 24/2009", translation_cn: "完全排除印尼本地消协法的适用力，并声明买方自愿舍弃双语对照法案效力。", explanation_cn: "Law No. 24 of 2009 is a mandatory public policy law in Indonesia. Excluding it is legally invalid in Indonesian territory, and any failure to establish a registered, legally binding bilingual counterpart renders the whole agreement prone to being ruled completely void by an Indonesian local judge." },
      { topic_cn: "极端不平衡的解约缓冲期差别", risk_level: "HIGH", original_text: "Seller may terminate in 24 hours without cause... Buyer must provide 12 months prior written notice.", translation_cn: "卖方可凭e-mail提早24小时解约并无责放任，买方离场必须老实发挂号信等待漫长12个月。", explanation_cn: "The asymmetric notification allows the Supplier to instantly break supply chains right before hot retail periods, while binding the Buyer to compulsory purchase quotas for a long 12-month period even if electronic sales crash locally in Indonesia." },
      { topic_cn: "极低 500 美元总责任包揽安全责任", risk_level: "HIGH", original_text: "cumulative liabilities... shall not exceed five hundred US dollars (USD 500)... Buyer unconditionally waives all rights to claim consequential", translation_cn: "卖方的全盘赔偿赔付最终累积定额极限定在 500 块美元内，且买方丢弃大灾求偿权。", explanation_cn: "If an unstable capacitor triggers a devastating commercial fire in your main Jakarta terminal, you will suffer catastrophic physical ruins but are contractually disallowed from claiming anything beyond five hundred USD from the negligent manufacturing source." },
      { topic_cn: "合同到期无需双签即可循环自动延续效力", risk_level: "MEDIUM", original_text: "automatically renew for additional 1-year terms continually, regardless of commercial retail performance", translation_cn: "期满后，在不知道买卖双方绩效或滞销状况下，合同效能及高滞纳金利息条款自动加钟自续1年。", explanation_cn: "Prevents a clean commercial exit, locking the Buyer inside unstable price modification risks and predatory interest cycles indefinitely, unless they trigger the difficult 12-month written exit notification in advance." }
    ],
    missing_clauses: [
      { name_cn: "Incoterms 2020国际贸易船货运输和海事责任点分工", name_id: "Klausul Kejelasan Incoterms 2020 (CIF Tanjung Priok)", importance_cn: "Without a precise Incoterm (e.g., CIF Jakarta or FOB Nanshan), there is zero clarity about which party coordinates custom clearance, local import taxes, ocean cargo insurance, or bear warehouse demurrage at the container yard." },
      { name_cn: "合格的电子大宗采购 RMA 质检抵退及售后退补机制", name_id: "Kebijakan RMA Komersial dan Pemotongan Invoice Cacat", importance_cn: "A must-have for bulk hardware purchase. Lacking a credit-memo or 1.5% batch-replacement allowance forces the Buyer to sit on broken inventory or incur excessive logistics expenses returning physical boards back to China." },
      { name_cn: "双语一比一对照签署机制（Mandarin & Indonesian Dual Version）", name_id: "Kewajiban Kontrak Bilingual Bahasa Indonesia (UU 24/2009)", importance_cn: "Crucial for defensive purposes inside Indonesia. This avoids the risk of local courts declaring the contract contractually non-existent, and is requisite for smooth trading permit approvals by Trade Ministry inspects." },
      { name_cn: "第 3 方中立且高信誉的 SIAC 新加坡国际中心管辖", name_id: "Klausul Penyelesaian Sengketa Arbitrase SIAC Singapura", importance_cn: "Splendid neutral ground. Bypasses the disadvantages of foreign local courts, reduces costs for the Buyer, and yields a highly professional UNCITRAL-based international resolution enforceable across both China and Indonesia." }
    ],
    cultural_legal_notes: [
      "Chinese electronic hardware providers from Shenzhen often leverage 'abridged local sales slips' to maximum speed and skip high manufacturing liabilities. Importers must remember that verbal promises of quality returns ('we will send extras in the next box') mean nothing in court. All warranties must be in writing.",
      "Under Indonesian Civil Procedure, an Indonesian judge will strictly prioritize local consumer safety and language sovereignty. A pure English/Chinese agreement signed without a verified Indonesian bilingual counterpart will easily be struck down in an Indonesian Court, rendering any local collection or seizure efforts impossible.",
      "The 5% weekly compounded interest rate is civilly illegal in multiple jurisdictions and will be deemed usurious by an Indonesian District Court. Under Pasal 1338 KUHPerdata, courts can and will dramatically slash unfair interest down to reasonable standard commercial lending averages of 6-12% simple annual interest."
    ],
    full_translation_mandarin: `**国际货物买卖合同 (Bilingual Terjemahan Ref) / 双方买卖契约精译对照文本**

合同编号：CN-ID-SG-2025-0017
签订日期：2025年3月28日
签订地点：中国广东省深圳市南山区科技园南路10号

**卖方（供应商/甲方）：** Guangzhou Dingsheng Electronic Technology Co., Ltd.（广州鼎盛电子科技有限公司），一家依据中国法律注册并存续的实体（以下简称“卖方”）。

**买方（进口商/乙方）：** PT Sinar Jaya Elektronik Indonesia，一家依据印度尼西亚法律设立运行的合规进出口一般贸易株式会社（以下简称“买方”）。

双方经友好、自主在深圳协商一致，就本年度及后续批次电子产品离岸采购销售事宜，特达成如下单方高危条款以资遵守：

### 第一条：价格任意调整及单方价格控制权 (Klausul Hak Penyesuaian Harga Sepihak)
1. 电子产品的基本单价基于首笔大宗采购定单。然而，卖方由于不可控之半导体晶圆短缺、劳动力用工价格溢水、汇率大跌等主观商业利益调控目的，**保留单方面（unilaterally）任意更改并调高本合同一切履行中订单或新 PO 货物货款价格的绝对终身主权**。价格调整的最终幅度及折算计算公式悉数由卖方单方全权自主决定。
2. 卖方唯需通过书面电子邮件提前 **7个日历日** 向买方代表发出调价通知字样，自该封带有调价字眼的邮件送达第8日起，新增加的溢价单价在法律契约上**自动即刻生效**。
3. 买方承诺：一经签字即视为自愿、不可撤销地完全承兑并必须如期依照该新高价格全盘给付账单，买方彻底**放弃因为对于单价调高手续持有异议而宣布退单、拒绝付汇、拖延清关开信用证或要求退回定金的全部正当商业和民事抗辩权**。

### 第二条：品质免责协议与极其苛刻的雅加达港3日质检限制 (Penolakan Jaminan Mutu & Pemeriksaan 3 Hari)
1. 卖方送抵雅加达海关码头的全部电子成品及零配件，一律以在深圳/广州工厂出厂阶段的 **出厂原样/现况（As-is basis）** 交付，不承担涉及任何功能质量保障、原厂保修等法定最基础义务。
2. 卖方**明确且完整地彻底免除任何明示或暗示的、旨在保障其在印尼国内商超销售可用之电路物理安全性、无安全自燃事故、特定行业设计规范契合的品质信用责任担保**。
3. 货物海运抵达雅加达 Tanjung Priok 港卸港卸货开始之日起，买方**必须在 3 个日历天（3 Hari Kalender）内完成所有集装箱集装箱内部精密电子的功能清点和彻底质检，并向卖方投递挂号信的书面质量残次报告**。如果超过3天时间买方未提交质检残次异议执勤单，即在法律上构成买方对该批货物完美履约、零瑕疵的**绝对认可和全盘接受**。买方往后无能追索因卖方用料低下而在数月后触发的大规模电源引爆自燃、电路融化失效等无法弥补的致命质量安全灾祸，卖方对所有终端民事连带诉讼追偿享有绝对法律豁免。
4. 在任何案情判例和索偿环境下，卖方因发货重大电路质量事故连带引发买方仓储火灾毁林、声誉垮台、消费者退换赔偿等，卖方所承担的最终全部最高累计赔偿上限**死死限定在最高绝对不能超出 500美元（USD 500）** 的极低封顶数字中。买方承诺放弃向其索偿任何一分钱的连带利润损失（Consequential damage）。

### 第三条：付款期限、印尼外汇购汇流转延迟与高达每周5%复利迟延罚息 (Termin Pembayaran & Penalty 5% Compounded Weekly)
1. 买方必须在卖方将商业发票传寄之日起 **7个工作日** 内，彻底通过电汇（T/T）方法开具全额的美元（USD）无限制离岸足额结算。
2. 任何因为雅加达印度尼西亚银行（Bank Indonesia）对境外特大额美金洗钱监控审查流程滞延等行政迟滞原因，均不被卖方理会，该支付延迟对买方构成**完全的主观违约行为**。
3. 针对一切逾期未清还的利息资本款项，买方从违约首日起，必须向卖方缴纳 **每周 5% 的严重惩罚性违约逾期滞纳金（compounded weekly）**。该利息按周采用最暴力的复利循环计算，计收数额无限累加无任何cap封顶比例限制。

### 第四条：买方数字资产、推广客户数据库无偿被收割清算 (Forfeiture Database Pelanggan)
1. 双方明确，买方为了在雅加达等核心商业区建立“Dingsheng”品牌，不惜耗费其多年运营资本、投放TikTok/印尼社媒自研 of 本地客户销售名单（customer relationships）、本地渠道合同原案、经买方翻译并改造 of 印尼文设备说明版本等全部丰厚商业数字心血。
2. 在本合同不管是1年到运期满，还是中途因涉讼、不达目标而遭到提前破产，上述属于买方专有知识和数据财产利益在到期日、解约日当天，**以绝对零价格自动归入属于卖方广州鼎盛科技独占所有**。买方在3日内必须无保留交接完整的客户联系档案库、电话索引，否则须赔偿卖方高昂渠道脱节罚金。

### 第五条：非对称、闪电24小时与超长12个月的合同告知期限 (Pemutusan Sepihak Timpang)
1. 卖方仅仅由于全球配额调动等纯粹的“行政便利”或自我主观需求，**即有特权通过发送电子邮件提早 24小时 宣布整份购销框架不附加条件作废**，且不承担买方下游商超追付的任何解约金赔付。
2. 倘因特殊原因，买方希望主动请求提前离开本采购地狱，买方必须**提早整整 12个月 之前** 递送实物公章挂号信进行正式解约申请。这12个月告知缓冲内，买家即使在雅加达本地一分钱货物都卖不出，**由于一笔PO已经被录入生产线，买家仍然必须咬牙全额接收并付款，拖延直接扣罚并计算 compounding weekly 5% 的利滚利盘扣**。

### 第六条：中国深圳法院绝对排他主权司法管辖 (Yurisdiksi Pengadilan Nanshan, Shenzhen)
1. 本合同在所有环节上全盘排他适用中华人民共和国大陆民商法，排除印尼消费者权利保护等公序良俗法则。
2. 双方明确、完全排除印尼 UU No. 24/2009 对于国际外贸文本强制双语对照的规定，买方在知情下全盘自愿放弃印尼语本合同效力，即使因此在雅加达最高院打官司被判定自始不符由于中英对照缺失而导致虚幻，亦属于买方自身疏怠过失所致，买方不因该政策漏洞提出辩白。
3. 所有因本协议纠纷发起的任何形式起诉，必须只能诉诸并且去往 **中国广东省深圳市南山区人民法院** 诉起官司，拒绝向雅加达民事法庭等有权机构起诉。买单单方面背负在深圳进行的起诉、律师函、法庭认证纸、全套宣誓双认证翻译费，且不能对该境外管辖权提起任何地方法律不当异议反诉。

代表签字盖章授权（卖方 Guangzhou Dingsheng 盖红章）：张伟宏 _________________
代表签字盖章授权（买方 PT Sinar Jaya 按并印尼公章）：Budi Santoso _________________`
  }
};

// ============================================================================
// NEW AND ACCURATE MOCK WORLD-WIDE RAW CONTRACT TEXTS (MAPPED TO THE THREE DEMOS)
// ============================================================================

export const ID_DEMO_CONTRACT_TEXT = `PERJANJIAN JUAL BELI BARANG INTERNASIONAL
Nomor Kontrak: CN-ID-SG-2025-0017
Tanggal Penandatanganan: 28 Maret 2025
Tempat Penandatanganan: Gedung 10 Science & Technology Park Road, Distrik Nanshan, Kota Shenzhen, Provinsi Guangdong, Republik Rakyat Tiongkok (RRT)

PIHAK PENJUAL (Pemasok):
Guangzhou Dingsheng Electronic Technology Co., Ltd.
Unified Social Credit Code: 91440101MA5C7K9L2X
Alamat Terdaftar: Room 1201, Taikoo Hui Office Tower, No. 385 Tianhe Road, Distrik Tianhe, Kota Guangzhou, Provinsi Guangdong, RRT
Perwakilan Hukum: Zhang Weihong
Kontak & Telepon: Li Minghua +86 138 0012 5678
E-mail: l.minghua@dinsheng-tech.cn

PIHAK PEMBELI (Importir):
PT Sinar Jaya Elektronik Indonesia
Nomor Registrasi Perusahaan: 9123456789-001
Alamat Terdaftar: Jl. Mangga Dua Raya No. 88, Kelurahan Pademangan Barat, Kecamatan Pademangan, Jakarta Utara 14420, Indonesia
Perwakilan Hukum: Budi Santoso
Kontak & Telepon: Ahmad Rizki +62 812 3456 7890
E-mail: ahmad.rizki@sinarjaya.co.id

Bahwa Penjual memiliki kapasitas produksi untuk menyuplai peralatan elektronik, dan Pembeli bermaksud mengimpor barang tersebut dari Penjual. Para pihak bersepakat untuk mengikatkan diri dalam Perjanjian Jual Beli Internasional ini dengan ketentuan-ketentuan yang timpang dan sepihak di bawah ini:

Pasal 1: Penyesuaian Harga Sepihak Secara Mendadak
1. Harga dasar barang elektronik didasarkan pada kesepakatan awal pesanan pertama. Namun, karena fluktuasi biaya chip komponen, pergeseran nilai valuta asing, dan kenaikan beban utilitas pabrikan, Penjual mempertahankan hak mutlak tak terbatas untuk secara sepihak (unilaterally) mengubah dan menaikkan harga unit barang dalam lembaran pesanan (PO) kapan pun.
2. Penjual hanya berkewajiban mengirimkan pemberitahuan tertulis mengenai kenaikan harga tersebut melalui e-mail kepada Pembeli dalam kurun waktu 7 hari kalender sebelum harga baru tersebut diaktifkan secara komersial.
3. Pembeli dengan ini menyatakan komitmen mutlaknya untuk menerima seluruh kenaikan harga dan melakukan pembayaran penuh sesuai tagihan baru tersebut. Pembeli melepaskan haknya untuk membatalkan pesanan berjalan, menolak kiriman, atau menuntut kompensasi selisih bea kepabeanan.

Pasal 2: Penafsiran Kualitas Produk "As-Is" Tanpa Garansi Pabrik
1. Peralatan elektronik dan komponen penunjang yang diselesaikan di pabrik Guangzhou dipasok kepada Pembeli berdasarkan kondisi fisik apa adanya pada titik pelabuhan keberangkatan (AS-IS basis).
2. Penjual secara tegas menafikan dan tidak bersedia memikul jaminan perlindungan mutu produk, baik garansi tersurat maupun implisit mengenai kelayakan dagang, circuit keselamatan, atau pemakaian fungsional di pasar domestik Indonesia.
3. Pembeli wajib melakukan pemeriksaan visual penuh atas kualitas fisik barang kontainer di pelabuhan Tanjung Priok, Jakarta paling lambat dalam waktu 3 hari kalender setelah barang dibongkar (unloading). Jika Pembeli tidak melayangkan komplain tertulis dalam kurun waktu 3 hari tersebut, barang secara mutlak dianggap dalam kondisi prima, dan Pembeli kehilangan segala hak pembelaan hukum atas cacat rahasia (hidden defects), kerusakan kelistrikan, atau malfungsi bawaan pabrik setelahnya.
4. Total akumulasi liabilitas ganti rugi Penjual atas cacat pengiriman, kebakaran sirkuit kelistrikan, penarikan barang massal (recall), atau kerugian finansial reputasi Pembeli di bawah kontrak ini dibatasi maksimal sebesar USD 500 secara akumulatif. Pembeli secara sukarela melepaskan seluruh hak tuntutan ganti rugi sekunder, kerugian kelanjutan (consequential damages), atau denda punitif dari Penjual.

Pasal 3: Tenggat Pelunasan Faktur Singkat & Denda Bunga Majemuk Mingguan 5%
1. Pembeli wajib melakukan pelunasan penuh atas seluruh nilai faktur ekspor dalam mata uang Dollar Amerika Serikat (USD) ke akun bank Penjual selambat-lambatnya 7 hari kerja sejak tanggal tagihan invoice diterbitkan.
2. Keterlambatan pelunasan dengan alasan apa pun, tidak terkecuali kendala regulasi devisa perbankan Indonesia, akan dikenakan denda keterlambatan sebesar 5% per minggu dari nilai nominal tertunggak.
3. Denda keterlambatan pembayaran ini akan dihitung secara berlipat ganda kumulatif melalui bunga majemuk mingguan (compounded weekly) tanpa adanya batasan nilai denda maksimum (no cap).

Pasal 4: Pengambilalihan Hak Merek dan Basis Data Pelanggan Lokal Indonesia
1. Seluruh investasi pemasaran, lokalisasi bahasa, pengembangan jaringan dealer fisik, serta relasi basis pelanggan (customer database) yang dibangun oleh Pembeli menggunakan asupan modal pribadi di Indonesia, akan secara otomatis beralih menjadi hak milik tunggal Penjual secara cuma-cuma (tanpa pembayaran kompensasi apa pun) pada saat perjanjian ini berakhir atau dihentikan.
2. Pembeli wajib menyerahkan catatan log pelanggan dalam waktu 3 hari kerja sejak tanggal pengakhiran hubungan dagang ini demi kelancaran penjualan distributor pengganti pilihan Penjual.

Pasal 5: Klausul Pemutusan Hubungan Kontrak yang Timpang
1. Penjual memiliki wewenang penuh untuk memutuskan komitmen jual beli ini kapan saja dan secara seketika (instant termination) dalam waktu 24 jam setelah mengirimkan surat pemberitahuan melalui e-mail tertulis tanpa memerlukan alasan kesalahan apa pun (without cause clauses) dan bebas dari tanggung jawab pesangon atau kerugian ekonomi Pembeli.
2. Sebaliknya, Pembeli dibatasi hak usahanya dan dipaksa untuk terus melakukan pembelian kuota tahunan. Pembeli hanya diperbolehkan menghentikan kontrak ini dengan mengirimkan surat pemberitahuan tertulis minimum 12 bulan sebelumnya (12 months prior written notice) melalui kurir internasional terdaftar.

Pasal 6: Hukum Pengatur RRT Eksklusif & Pengadilan Distrik Shenzhen
1. Konstruksi legalitas, penafsiran pasal, pelaksanaan komitmen, dan resolusi sengketa dari Kontrak ini diatur sepenuhnya dan tunduk pada hukum perdata dagang Republik Rakyat Tiongkok (RRT).
2. Para pihak secara sadar menyingkirkan penerapan seluruh yurisdiksi sistem peradilan Indonesia dan menafikan keberlakuan hukum perlindungan konsumen domestik Indonesia, termasuk persyaratan naskah bilingual dwibahasa di bawah UU No. 24/2009.
3. Setiap konflik hukum wajib diajukan dan diadili secara eksklusif kepada yurisdiksi Pengadilan Rakyat Distrik Nanshan, Kota Shenzhen, RRT. Segenap biaya sewa legal perdata, biaya saksi ahli, dan transportasi sidang ditanggung penuh secara mandiri oleh Pembeli.

Pasal 7: Perpanjangan Otomatis Tanpa Review Kinerja
1. Durasi Perjanjian Jual Beli ini berlaku selama 1 tahun sejak ditandatangani.
2. Apabila tidak ada pengakhiran resmi, kontrak ini akan otomatis diperpanjang untuk tahun-tahun berikutnya (automatic renewal) secara hukum tanpa adanya peninjauan ulang terhadap pencapaian volume perdagangan atau kelengkapan mutu produk dari Penjual.

Perjanjian ini ditandatangani oleh perwakilan pihak-pihak dengan kesadaran hukum penuh pada tanggal tercantum di atas.

Penjual (Guangzhou Dingsheng Co., Ltd.): Zhang Weihong _________________
Pembeli (PT Sinar Jaya Elektronik Indonesia): Budi Santoso _________________`;

export const CN_DEMO_CONTRACT_TEXT = `国际货物买卖合同
合同编号：CN-ID-SG-2025-0017
签订日期：2025年3月28日
签订地点：中国广东省深圳市南山区科技园南路10号

卖方（供应商）：广州鼎盛电子科技有限公司
统一社会信用代码：91440101MA5C7K9L2X
注册地址：中国广东省广州市天河区天河路385号太古汇写字楼1201室
法定代表人：张伟宏
联系人及电话：李明华 +86 138 0012 5678
电子邮箱：l.minghua@dinsheng-tech.cn

买方（进口商）：PT Sinar Jaya Elektronik Indonesia
公司注册号：9123456789-001
注册地址：Jl. Mangga Dua Raya No. 88, Kelurahan Pademangan Barat, Kecamatan Pademangan, Jakarta Utara 14420, Indonesia
法定代表人：Budi Santoso
联系人及电话：Ahmad Rizki +62 812 3456 7890
电子邮箱：ahmad.rizki@sinarjaya.co.id

鉴于卖方具备本合同项下货物的生产与供应资质，买方有意自卖方处进口该等货物，双方本着平等互利的原则，在深圳友好协商，就本年度及后续批次电子元器件与设备贸易，达成如下国际买卖协议，以资信守：

第一条 货物品名、数量与临时单价
1. 买方根据实际零售分销需求，向卖方下达具体的采购定单。定单应说明产品型号、规格、包装及交货期。
2. 基础货物价格由双方在首单附件中约定。由于芯片等原材料涨价、国际汇率剧烈波动及用工成本上涨等不可控因素，卖方保留随时 unilaterally（单方面）调整、提高本协议及任何未履行订单中货物单价的至高权利（价格调整幅度由卖方自行裁量）。
3. 卖方只需提前7天通过电子邮件通知买方该项价格调整，自通知发出第8日起，新单价即自动生效。买方承诺：完全接受并依此新价格如期全额承付，不得因单价更改而提出延迟开证、缩扣货款、取消未履行订单或主张任何形式的关税等间接赔偿。

第二条 质量保证免责及交货验收
1. 卖方所提电子设备及零部件均在广州工厂出厂。所有产品交付买方时，以国际最简易“出厂现状”为准（AS-IS basis，即现况交货、不附任何产品缺陷质保担保）。
2. 卖方明确否认、不承担任何关于产品品质、特定商业用途或耐用寿命的明示或默示的法定保证责任（对产品质量、耐用度、电路安全性不承担任何明示和暗示的品质保证担保）。
3. 买方收货后，必须在货物运抵印尼雅加达港口卸货之日起3日内，完成外观全检并向卖方提出书面质量异议。如果超出此3日时限买方未书面异议，即视为所交货物质量100%合格无瑕疵，买方此后永久丧失就该批次货物主张短少、外观损坏、内部隐藏绝缘/电路设计缺陷、不合本地安全标准的法律起诉抗辩权。
4. 在任何情况下，卖方对买方就任何批次产品不良（包含因产品缺陷导致的火灾、人身安全事故、商誉损失或预期利润破灭）所承担的累积赔偿责任，在法律允许范围内，最高绝对不超过500美元（USD 500），买方自愿放弃索求商业间接、连带、惩罚性赔偿的所有法定契约民事权利。

第三条 付款期限与惩罚性逾期罚息
1. 买方应在卖方开具电汇账单发票之日起7个工作日内，以美元（USD）全额电汇至卖方指定的中国境内银行或离岸账户。
2. 若买方由于银行跨国合规核查、印尼本地美元购汇管制、公共节假日延迟等任何客观原因导致未能按期足额汇出款项的，每日均属于实质性完全违约。
3. 从违约首日算起，就未结清的逾期款项，买方必须向卖方承付每周5%（5% compounded weekly）的累进逾期迟延罚金。该迟延金以周为单位，实施最严厉的周滚动复利计息（即上一周累积之大额罚金悉数计入本金复利循环计罚），不设任何最高封顶比例限制。

第四条 商业推广、渠道沉淀与知识产权自愿过渡
1. 双方在本协议期间共同拓展印尼电子市场。买方使用其印尼本地渠道、本地销售团队和广告投入，所树立的“Dingsheng”品牌市场声望、印尼本地分销商/二级零售网络、最终忠实客户采购数据（customer relationships）以及印尼语本地化 adaptation 宣传资料。
2. 在本合同因任何原因终止或期满之日，上述所有在印尼渠道沉淀、客户网络和推广版权利益，均以零价格（零对价）自动、完整移转归属于卖方独占所有，买方应在终止后3日内，无偿向卖方正式交付完整的印尼商户客户清单资料，并协助进行渠道交接。

第五条 合同终止及非对称告知期
1. 鉴于卖方有权灵活调整全球生产以及分销配额，卖方可随时出于业务便利之主观原因，通过电子邮件下发书面解约通知，在发出通知24小时后提前即时终止本协议，且不承担任何终止后的补偿。
2. 反之，在市场拓展初期，为确保卖方的排他性产能规划与物料周转不出现闲置，买方仅能通过提前整整12个月，以预先寄送国际快递挂号书面通知的方式，方能向卖方申请解约；在此12个月缓冲期内，买方仍必须不打折扣地向卖方采购并接收原定额度采购订单，否则须承担重大违约金。

第六条 强制性适用法律与非对称管辖权
1. 本协议在效力构建、商务解释及争议解冻流程上，全权受中国大陆法律（不包括冲突法）管辖。
2. 当发生本合同纠纷或与本买卖往来相关的任何涉外诉讼纠纷时，双方在此明示，自愿完全、彻底地排除印尼现行任何强制性法律（包括关于合同必须设立印尼对照文本、印尼本地消费者质保权利及印尼民事管辖权的相关法规）的一切适用性。
3. 本协议的一切纠纷应提交至中国广东省深圳市南山区人民法院管辖起诉，买方彻底排除向印尼本地民事诉讼法庭请求调查、起诉或异地执行财产的主权司法抗辩权；一切由于起诉产生之审理费、律师差旅费、深圳翻译公证查档费用均由买方单方面全盘自理和担保承接。

第七条 合约自动延签
1. 本协议契约有效期初始设计为自签署日起12个月。
2. 期满之日，无需双方专门签署续展，本合同效力及一切不平衡约束机制将自动每次重新延续加时1年，循环往复。即使买方在当年出现大额滞销、亏损、或质量拒签事故，自动延续同样生效不受干扰。

第八条 双方盖印确认
卖方签字盖章（广州鼎盛科学电子授权印）：张伟宏 _________________
买方签字盖章（PT Sinar Jaya 总裁代表按手印及公司红印）：Budi Santoso _________________`;

export const ENG_DEMO_CONTRACT_TEXT = `INTERNATIONAL GOODS PURCHASE AND SALE AGREEMENT
Contract Number: CN-ID-SG-2025-0017
Date of Execution: March 28, 2025
Place of Execution: 10 Science & Technology Park Road, Nanshan District, Shenzhen, Guangdong Province, P.R. China

THE SELLER (Supplier):
Guangzhou Dingsheng Electronic Technology Co., Ltd.
Unified Social Credit Code: 91440101MA5C7K9L2X
Registered Address: Room 1201, Taikoo Hui Office Tower, No. 385 Tianhe Road, Tianhe District, Guangzhou, Guangdong Province, China
Legal Representative: Zhang Weihong
Contact Person & Phone: Li Minghua +86 138 0012 5678
E-mail: l.minghua@dinsheng-tech.cn

THE BUYER (Importer):
PT Sinar Jaya Elektronik Indonesia
Company Registration Number: 9123456789-001
Registered Address: Jl. Mangga Dua Raya No. 88, Kelurahan Pademangan Barat, Kecamatan Pademangan, Jakarta Utara 14420, Indonesia
Legal Representative: Budi Santoso
Contact Person & Phone: Ahmad Rizki +62 812 3456 7890
E-mail: ahmad.rizki@sinarjaya.co.id

WHEREAS, the Seller possesses the production qualifications for the electronic goods under this Agreement, and the Buyer intends to import such goods from the Seller, the parties hereby agree to bind themselves to this highly asymmetric unilateral contract subject to the terms and conditions set forth below:

Article 1: Unilateral Price Modification Right
1. Initial component pricing is specified in the first purchase schedule. However, due to raw material cost fluctuations, global exchange rate spikes, or factory overhead inflation, the Seller reserves the absolute, unilateral right (unilaterally) to adjust, increase, or modify the unit price of any product in outstanding or incoming commercial orders at any time.
2. The Seller is only required to send a 7-calendar-day prior written notice of such price adjustments via electronic mail to the Buyer before the new prices become legally effective.
3. The Buyer hereby guarantees full and unconditional commitment to honor and pay all invoices using such newly modified pricing without any right to postpone payment, reject shipments, cancel pending purchase orders, or claim import tariff concessions or secondary financial damages.

Article 2: Exclusion of Product Warranty & Port acceptance
1. All electronic components and accessories delivered from the Guangzhou factory to the Buyer are supplied on a strict "AS-IS" basis at the port of departure.
2. The Seller explicitly disclaims all statutory and common-law representations and warranties, whether express or implied, including but not limited to any warranty of merchantability, fitness for local retail/distributorship purposes, durability, and compliance with domestic Indonesian electrical standards.
3. The Buyer MUST perform a complete visual and functional inspection of the cargo at the port of Tanjung Priok, Jakarta within 3 calendar days of offloading. Failure to raise written complaints within 3 days translates to full and absolute acceptance of the shipment, and the Buyer forever waives all rights to claim hidden defects, manufacturing flaws, or safety issues.
4. Capitalized cumulative liabilities of the Seller for commercial defects, circuit hazards, consumer recalls, or local compliance warnings shall not exceed five hundred US dollars (USD 500) under any circumstances. The Buyer unconditionally waives all rights to claim consequential, indirect, loss of profits, or punitive damages.

Article 3: Invoicing terms & Compound Late Payment Penalty
1. The Buyer shall pay all export invoices in US Dollars (USD) via wire transfer within 7 business days from the invoice issuance date.
2. Delayed payment for any reason, including Indonesian foreign exchange bank regulatory checks, holidays, or system downtime, shall constitute an immediate material default.
3. Overdue principal amounts shall accumulate a weekly late penalty of five percent (5%), compounded weekly. This penalty will accrue compounding interest recursively without any percentage cap or maximum limitation.

Article 4: Ex-Post Forfeiture of Local Trademarks and Customer DB
1. All local advertising materials, software Indonesian translation modifications, dealer networks, and customer databases (customer relationships) built through the Buyer's private investments in Indonesia shall automatically transfer, at zero cost and without compensation, to the sole and exclusive ownership of the Seller upon termination.
2. The Buyer must turn over all customer purchase history logs within 3 business days of contract termination to facilitate the transition of marketing activities to the Seller's subsequent dealer.

Article 5: Asymmetric Termination Notices
1. The Seller may terminate this commercial agreement immediately, with 24 hours prior email notification, without cause, and without any obligation to pay severance, termination benefits, or retail market loss compensation.
2. Conversely, the Buyer must maintain purchases to meet material quotas and may only terminate this agreement by providing a minimum of 12 months prior written notice via registered international courier.

Article 6: Selection of Foreign Jurisdiction and PRC Law
1. This Agreement is constructed, governed, and interpreted exclusively in accordance with the substantive laws of the People's Republic of China.
2. The parties expressly exclude the application of Indonesian Consumer Law, bilingual translation enforceability under Law No. 24/2009, and the jurisdiction of any civil court of the Republic of Indonesia.
3. Any dispute arising from this trade relationship shall be resolved exclusively by the People's Court of Nanshan District, Shenzhen City, PRC. All litigation expenses, administrative filing fees, attorney fees, and translation fees shall be borne solely by the Buyer.

Article 7: Automatic Contract Extension
1. The initial term of this Purchase Agreement is 12 months from the execution date.
2. Unless officially dissolved, this contract and all its asymmetric encumbrances shall automatically renew for additional 1-year terms continually, regardless of commercial retail performance or prior shipment quality disputes.

IN WITNESS WHEREOF, the authorized representatives have executed this Agreement on the date of signing.

Seller (Guangzhou Dingsheng Co., Ltd.): Zhang Weihong _________________
Buyer (PT Sinar Jaya Elektronik Indonesia): Budi Santoso _________________`;
