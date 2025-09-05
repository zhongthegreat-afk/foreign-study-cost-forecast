// src/App.tsx
import { CITIES, CURRENCY_SYMBOL, Currency } from './data';
import { estimateAnnualCost, formatMoney, Housing } from './estimator';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: 12, marginBottom: 16 }}>
      <h2 style={{ margin: 0, marginBottom: 12, fontSize: 18 }}>{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const [school, setSchool] = useState('');
  const [city, setCity] = useState<keyof typeof CITIES>('tokyo');
  const [housing, setHousing] = useState<Housing>('shared');
  const [lifestyle, setLifestyle] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [customEssentials, setCustomEssentials] = useState<string>('800');
  const [customRent, setCustomRent] = useState<string>('1200');

  const est = useMemo(() => {
    return estimateAnnualCost({
      city,
      school,
      housing,
      lifestyle,
      currency,
      custom: {
        essentialsUSD: Number(customEssentials),
        rentUSD: Number(customRent),
      },
    });
  }, [city, school, housing, lifestyle, currency, customEssentials, customRent]);

  const symbol = CURRENCY_SYMBOL[currency];

  return (
    <div style={{ maxWidth: 880, margin: '40px auto', padding: 16, fontFamily: 'ui-sans-serif,system-ui,Segoe UI,Roboto' }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Life Cost Planner（MVP）</h1>
        <p style={{ color: '#6b7280', marginTop: 8 }}>
          输入你的城市、学校与生活档次（吃喝玩乐“豪华程度”），立即估算未来一年的总开销区间。
        </p>
      </header>

      <Section title="基本信息">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>学校（可选）</span>
            <input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g., The University of Tokyo"
              style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span>货币</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            >
              <option value="USD">USD（$）</option>
              <option value="CNY">CNY（¥）</option>
              <option value="JPY">JPY（¥）</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span>城市</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value as keyof typeof CITIES)}
              style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            >
              {Object.entries(CITIES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span>居住类型</span>
            <select
              value={housing}
              onChange={(e) => setHousing(e.target.value as Housing)}
              style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            >
              <option value="shared">合租/宿舍</option>
              <option value="studio">单间/小公寓</option>
              <option value="luxury">高端公寓</option>
            </select>
          </label>
        </div>

        {city === 'other' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>自定义每月基础生活费（不含房租，USD）</span>
              <input
                type="number"
                value={customEssentials}
                onChange={(e) => setCustomEssentials(e.target.value)}
                min={200}
                style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
              />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>自定义每月房租（USD）</span>
              <input
                type="number"
                value={customRent}
                onChange={(e) => setCustomRent(e.target.value)}
                min={0}
                style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
              />
            </label>
          </div>
        )}
      </Section>

      <Section title="生活档次（吃喝玩乐“豪华程度”）">
        <div style={{ display: 'grid', gap: 8 }}>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={lifestyle}
            onChange={(e) => setLifestyle(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' }}>
            <span>1 朴素</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5 豪华</span>
          </div>
          <small style={{ color: '#6b7280' }}>
            注：当前算法会把生活档次作为乘子（0.8 → 1.6）作用在“基础生活费 + 房租”之上。
          </small>
        </div>
      </Section>

      <Section title="结果">
        <ResultCard annualMin={est.annualMin} annualMax={est.annualMax} currency={currency} />
        <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
          * 区间含随机性与差异：按中心值的 -8% ~ +12% 给出波动范围；仅为 MVP 估算，后续可加入更精细因子。
        </div>
      </Section>

      <footer style={{ color: '#9ca3af', fontSize: 12, marginTop: 16 }}>
        下一步我们会：① 加入更多城市与学校的快捷选择；② 增加“吃喝玩乐”细分科目；③ 一键分享与 GitHub Pages 部署。
      </footer>
    </div>
  );
}

function ResultCard({ annualMin, annualMax, currency }: { annualMin: number; annualMax: number; currency: Currency }) {
  const minText = formatMoney(annualMin, currency);
  const maxText = formatMoney(annualMax, currency);

  // 简单的条形可视化
  const width = 100;
  return (
    <div style={{ background: '#f9fafb', padding: 16, borderRadius: 12 }}>
      <div style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>未来一年预计总开销（区间）</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>
        {minText} ~ {maxText} <span style={{ fontSize: 14, color: '#6b7280' }}>({currency})</span>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ height: 10, background: '#e5e7eb', borderRadius: 999, position: 'relative', width: `${width}%` }}>
          <div
            style={{
              position: 'absolute',
              left: '8%',
              right: '12%',
              top: 0,
              bottom: 0,
              background: '#a5b4fc',
              borderRadius: 999,
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginTop: 4 }}>
          <span>较保守</span>
          <span>较宽松</span>
        </div>
      </div>
    </div>
  );
}
