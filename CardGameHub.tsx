"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type Suit = "spades" | "hearts" | "diamonds" | "clubs";
type Card = {
  suit: Suit;
  rank: string;
  value: number;
  id: string;
};

type Game = {
  id: string;
  name: string;
  category: string;
  players: string;
  time: string;
  difficulty: string;
  playable: boolean;
  localRules: boolean;
  summary: string;
  modes: string[];
  options: {
    key: string;
    label: string;
    type: "toggle" | "select";
    choices?: string[];
    defaultValue: boolean | string;
  }[];
};

const suits: { id: Suit; mark: string; color: string }[] = [
  { id: "spades", mark: "♠", color: "text-slate-950" },
  { id: "hearts", mark: "♥", color: "text-rose-300" },
  { id: "diamonds", mark: "♦", color: "text-sky-300" },
  { id: "clubs", mark: "♣", color: "text-emerald-300" },
];

const ranks = [
  { rank: "A", value: 14 },
  { rank: "2", value: 2 },
  { rank: "3", value: 3 },
  { rank: "4", value: 4 },
  { rank: "5", value: 5 },
  { rank: "6", value: 6 },
  { rank: "7", value: 7 },
  { rank: "8", value: 8 },
  { rank: "9", value: 9 },
  { rank: "10", value: 10 },
  { rank: "J", value: 11 },
  { rank: "Q", value: 12 },
  { rank: "K", value: 13 },
];

const soloModes = ["ひとり", "対AI"];
const tableModes = ["対AI", "1台で対戦", "2台で対面", "オンライン"];
const casinoModes = ["ひとり", "対AI", "オンライン"];

const games: Game[] = [
  {
    id: "poker",
    name: "ドローポーカー",
    category: "定番",
    players: "1人",
    time: "3分",
    difficulty: "ふつう",
    playable: true,
    localRules: true,
    summary: "5枚を配って、残すカードを選び、役の強さを狙います。",
    modes: casinoModes,
    options: [
      { key: "joker", label: "ジョーカーを入れる", type: "toggle", defaultValue: false },
      {
        key: "handTable",
        label: "役の判定",
        type: "select",
        choices: ["標準", "日本の家庭ルール寄り", "ワイルドカード強め"],
        defaultValue: "標準",
      },
    ],
  },
  {
    id: "blackjack",
    name: "ブラックジャック",
    category: "カジノ",
    players: "1人",
    time: "2分",
    difficulty: "やさしい",
    playable: true,
    localRules: true,
    summary: "21を超えないようにカードを引き、ディーラーより強い点を目指します。",
    modes: casinoModes,
    options: [
      { key: "dealerSoft17", label: "ディーラーはソフト17で引く", type: "toggle", defaultValue: false },
      { key: "doubleDown", label: "ダブルダウンあり", type: "toggle", defaultValue: true },
    ],
  },
  {
    id: "baccarat",
    name: "バカラ",
    category: "カジノ",
    players: "1人",
    time: "1分",
    difficulty: "やさしい",
    playable: true,
    localRules: false,
    summary: "プレイヤー側とバンカー側の、下一桁の点数を比べます。",
    modes: casinoModes,
    options: [
      {
        key: "thirdCard",
        label: "3枚目ルール",
        type: "select",
        choices: ["かんたん", "標準"],
        defaultValue: "かんたん",
      },
    ],
  },
  {
    id: "highlow",
    name: "ハイ&ロー",
    category: "短時間",
    players: "1人",
    time: "30秒",
    difficulty: "やさしい",
    playable: true,
    localRules: false,
    summary: "次のカードが今のカードより高いか低いかを当てます。",
    modes: soloModes,
    options: [
      { key: "sameWins", label: "同じ数字は当たり", type: "toggle", defaultValue: false },
    ],
  },
  {
    id: "war",
    name: "戦争",
    category: "短時間",
    players: "2人",
    time: "1分",
    difficulty: "やさしい",
    playable: true,
    localRules: true,
    summary: "同時に1枚ずつ出して、数字が大きい方が勝ちます。",
    modes: tableModes,
    options: [
      { key: "aceHigh", label: "Aを一番強くする", type: "toggle", defaultValue: true },
    ],
  },
  {
    id: "memory",
    name: "神経衰弱",
    category: "定番",
    players: "1〜4人",
    time: "5分",
    difficulty: "やさしい",
    playable: true,
    localRules: true,
    summary: "裏向きのカードから同じ数字のペアを見つけます。",
    modes: ["ひとり", "対AI", "1台で対戦", "2台で対面", "オンライン"],
    options: [
      {
        key: "boardSize",
        label: "枚数",
        type: "select",
        choices: ["12枚", "20枚", "52枚"],
        defaultValue: "12枚",
      },
    ],
  },
  {
    id: "daifugo",
    name: "大富豪",
    category: "地域ルール",
    players: "3〜5人",
    time: "10分",
    difficulty: "ふつう",
    playable: false,
    localRules: true,
    summary: "手札を早くなくすゲーム。地域ルールを細かく切り替えられます。",
    modes: tableModes,
    options: [
      { key: "revolution", label: "革命", type: "toggle", defaultValue: true },
      { key: "eightCut", label: "8切り", type: "toggle", defaultValue: true },
      { key: "suitLock", label: "縛り", type: "toggle", defaultValue: false },
      { key: "stair", label: "階段", type: "toggle", defaultValue: true },
    ],
  },
  {
    id: "sevens",
    name: "七並べ",
    category: "地域ルール",
    players: "3〜4人",
    time: "8分",
    difficulty: "ふつう",
    playable: false,
    localRules: true,
    summary: "7を中心に、同じマークの数字を順番につなげます。",
    modes: tableModes,
    options: [
      {
        key: "passLimit",
        label: "パス回数",
        type: "select",
        choices: ["3回", "4回", "無制限"],
        defaultValue: "3回",
      },
      { key: "wrap", label: "AとKをつなげる", type: "toggle", defaultValue: false },
    ],
  },
  {
    id: "oldmaid",
    name: "ババ抜き",
    category: "定番",
    players: "2〜6人",
    time: "6分",
    difficulty: "やさしい",
    playable: false,
    localRules: true,
    summary: "同じ数字のペアを捨て、最後にジョーカーを持たないようにします。",
    modes: tableModes,
    options: [
      { key: "jokerCount", label: "ジョーカー2枚", type: "toggle", defaultValue: false },
    ],
  },
  {
    id: "speed",
    name: "スピード",
    category: "反射神経",
    players: "2人",
    time: "3分",
    difficulty: "むずかしい",
    playable: false,
    localRules: false,
    summary: "場のカードに続く数字を素早く出して、手札を減らします。",
    modes: tableModes,
    options: [
      { key: "wrap", label: "AとKをつなげる", type: "toggle", defaultValue: true },
    ],
  },
  {
    id: "solitaire",
    name: "ソリティア",
    category: "ひとり",
    players: "1人",
    time: "10分",
    difficulty: "ふつう",
    playable: false,
    localRules: true,
    summary: "色違いで数字を重ね、すべてのカードを組札に移します。",
    modes: soloModes,
    options: [
      {
        key: "draw",
        label: "山札のめくり方",
        type: "select",
        choices: ["1枚めくり", "3枚めくり"],
        defaultValue: "1枚めくり",
      },
    ],
  },
  {
    id: "hearts",
    name: "ハーツ",
    category: "海外定番",
    players: "4人",
    time: "15分",
    difficulty: "むずかしい",
    playable: false,
    localRules: true,
    summary: "ハートとスペードQを避けて、失点を少なくします。",
    modes: tableModes,
    options: [
      { key: "shootMoon", label: "シュート・ザ・ムーン", type: "toggle", defaultValue: true },
    ],
  },
  {
    id: "spades",
    name: "スペード",
    category: "海外定番",
    players: "4人",
    time: "15分",
    difficulty: "むずかしい",
    playable: false,
    localRules: true,
    summary: "取れるトリック数を予想し、スペードを切り札として戦います。",
    modes: tableModes,
    options: [
      { key: "nilBid", label: "ニルビッドあり", type: "toggle", defaultValue: true },
    ],
  },
  {
    id: "rummy",
    name: "ラミー",
    category: "海外定番",
    players: "2〜4人",
    time: "12分",
    difficulty: "ふつう",
    playable: false,
    localRules: true,
    summary: "同じ数字や連番を作って、手札を整理していきます。",
    modes: tableModes,
    options: [
      { key: "joker", label: "ジョーカーを使う", type: "toggle", defaultValue: true },
    ],
  },
  {
    id: "crazy8",
    name: "クレイジーエイト",
    category: "海外定番",
    players: "2〜5人",
    time: "8分",
    difficulty: "やさしい",
    playable: false,
    localRules: true,
    summary: "同じマークか数字を出して、8でマークを変えます。",
    modes: tableModes,
    options: [
      { key: "drawTwo", label: "2は2枚ドロー", type: "toggle", defaultValue: true },
    ],
  },
  {
    id: "pageone",
    name: "ページワン",
    category: "地域ルール",
    players: "2〜6人",
    time: "8分",
    difficulty: "やさしい",
    playable: false,
    localRules: true,
    summary: "同じマークを出し、残り1枚になったら宣言します。",
    modes: tableModes,
    options: [
      { key: "call", label: "ページワン宣言必須", type: "toggle", defaultValue: true },
      { key: "special", label: "特殊カードあり", type: "toggle", defaultValue: false },
    ],
  },
];

const categories = ["すべて", ...Array.from(new Set(games.map((game) => game.category)))];

function createDeck() {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      suit: suit.id,
      rank: rank.rank,
      value: rank.value,
      id: `${suit.id}-${rank.rank}`,
    })),
  );
}

function shuffle<T>(items: T[]) {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function suitInfo(suit: Suit) {
  return suits.find((item) => item.id === suit) ?? suits[0];
}

function cardLabel(card: Card) {
  return `${suitInfo(card.suit).mark}${card.rank}`;
}

function blackjackValue(hand: Card[]) {
  let total = 0;
  let aces = 0;
  hand.forEach((card) => {
    if (card.rank === "A") {
      aces += 1;
      total += 11;
    } else {
      total += Math.min(card.value, 10);
    }
  });
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function baccaratValue(hand: Card[]) {
  return hand.reduce((sum, card) => sum + (card.value >= 10 ? 0 : card.value), 0) % 10;
}

function evaluatePoker(hand: Card[]) {
  const values = hand.map((card) => card.value).sort((a, b) => a - b);
  const counts = values.reduce<Record<number, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
  const groups = Object.values(counts).sort((a, b) => b - a);
  const flush = hand.every((card) => card.suit === hand[0].suit);
  const straight =
    values.every((value, index) => index === 0 || value === values[index - 1] + 1) ||
    values.join(",") === "2,3,4,5,14";

  if (straight && flush && values.includes(14)) return "ロイヤルストレートフラッシュ";
  if (straight && flush) return "ストレートフラッシュ";
  if (groups[0] === 4) return "フォーカード";
  if (groups[0] === 3 && groups[1] === 2) return "フルハウス";
  if (flush) return "フラッシュ";
  if (straight) return "ストレート";
  if (groups[0] === 3) return "スリーカード";
  if (groups[0] === 2 && groups[1] === 2) return "ツーペア";
  if (groups[0] === 2) return "ワンペア";
  return "ハイカード";
}

function CardFace({
  card,
  selected,
  onClick,
  compact = false,
}: {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}) {
  const info = suitInfo(card.suit);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex aspect-[3/4] min-h-20 flex-col justify-between rounded-md border bg-zinc-50 p-2 text-left shadow-sm transition ${
        selected ? "border-amber bg-amber/20 -translate-y-2" : "border-zinc-200"
      } ${onClick ? "active:scale-95" : "cursor-default"} ${compact ? "w-14" : "w-16 sm:w-20"}`}
    >
      <span className={`text-base font-black ${info.color}`}>{card.rank}</span>
      <span className={`text-center text-2xl font-black ${info.color}`}>{info.mark}</span>
      <span className={`rotate-180 text-base font-black ${info.color}`}>{card.rank}</span>
    </button>
  );
}

function EmptyCard({ label }: { label: string }) {
  return (
    <div className="flex aspect-[3/4] w-16 items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 p-2 text-center text-xs font-bold text-zinc-400 sm:w-20">
      {label}
    </div>
  );
}

export function CardGameHub() {
  const [category, setCategory] = useState("すべて");
  const [selectedId, setSelectedId] = useState("poker");
  const [mode, setMode] = useState("ひとり");
  const [settings, setSettings] = useState<Record<string, boolean | string>>(() =>
    Object.fromEntries(games.flatMap((game) => game.options.map((option) => [`${game.id}.${option.key}`, option.defaultValue]))),
  );
  const [pokerHand, setPokerHand] = useState<Card[]>(() => createDeck().slice(0, 5));
  const [pokerHeld, setPokerHeld] = useState<string[]>([]);
  const [blackjack, setBlackjack] = useState(() => newBlackjackRound());
  const [baccarat, setBaccarat] = useState(() => newBaccaratRound());
  const [highlow, setHighlow] = useState(() => newHighLowRound());
  const [war, setWar] = useState<{ player?: Card; cpu?: Card; score: number }>({ score: 0 });
  const [memory, setMemory] = useState(() => newMemoryBoard());

  const selectedGame = games.find((game) => game.id === selectedId) ?? games[0];
  const visibleGames = games.filter((game) => category === "すべて" || game.category === category);
  const playableCount = games.filter((game) => game.playable).length;

  useEffect(() => {
    resetPoker();
    setBlackjack(newBlackjackRound(true));
    setBaccarat(newBaccaratRound(true));
    setHighlow(newHighLowRound(true));
    setMemory(newMemoryBoard(true));
  }, []);

  function updateSetting(key: string, value: boolean | string) {
    setSettings((current) => ({ ...current, [`${selectedGame.id}.${key}`]: value }));
  }

  function drawPoker() {
    const deck = shuffle(createDeck()).filter((card) => !pokerHand.some((held) => held.id === card.id));
    const nextHand = pokerHand.map((card) => (pokerHeld.includes(card.id) ? card : deck.pop() ?? card));
    setPokerHand(nextHand);
    setPokerHeld([]);
  }

  function resetPoker() {
    setPokerHand(shuffle(createDeck()).slice(0, 5));
    setPokerHeld([]);
  }

  function hitBlackjack() {
    if (blackjack.status !== "playing") return;
    const deck = [...blackjack.deck];
    const nextPlayer = [...blackjack.player, deck.pop() ?? createDeck()[0]];
    setBlackjack({
      ...blackjack,
      deck,
      player: nextPlayer,
      status: blackjackValue(nextPlayer) > 21 ? "player-bust" : "playing",
    });
  }

  function standBlackjack() {
    const deck = [...blackjack.deck];
    const dealer = [...blackjack.dealer];
    while (blackjackValue(dealer) < 17) {
      dealer.push(deck.pop() ?? createDeck()[0]);
    }
    const playerScore = blackjackValue(blackjack.player);
    const dealerScore = blackjackValue(dealer);
    let status = "push";
    if (dealerScore > 21 || playerScore > dealerScore) status = "player-win";
    if (dealerScore <= 21 && dealerScore > playerScore) status = "dealer-win";
    setBlackjack({ ...blackjack, deck, dealer, status });
  }

  function guessHighLow(guess: "high" | "low") {
    const current = highlow.current;
    const next = highlow.deck.at(-1);
    if (!next) return;
    const sameWins = settings["highlow.sameWins"] === true;
    const correct =
      guess === "high"
        ? next.value > current.value || (sameWins && next.value === current.value)
        : next.value < current.value || (sameWins && next.value === current.value);
    const deck = highlow.deck.slice(0, -1);
    setHighlow({
      current: next,
      deck,
      streak: correct ? highlow.streak + 1 : 0,
      message: `${cardLabel(next)}: ${correct ? "正解" : "はずれ"}`,
    });
  }

  function playWar() {
    const [player, cpu] = shuffle(createDeck()).slice(0, 2);
    const result = player.value === cpu.value ? 0 : player.value > cpu.value ? 1 : -1;
    setWar((current) => ({ player, cpu, score: current.score + result }));
  }

  function flipMemory(index: number) {
    if (memory.open.includes(index) || memory.matched.includes(index) || memory.open.length >= 2) return;
    const open = [...memory.open, index];
    if (open.length === 2) {
      const [first, second] = open;
      const matched =
        memory.cards[first].rank === memory.cards[second].rank
          ? [...memory.matched, first, second]
          : memory.matched;
      setMemory({ cards: memory.cards, open, matched, moves: memory.moves + 1 });
      window.setTimeout(() => {
        setMemory((current) => ({ ...current, open: [], matched }));
      }, 650);
      return;
    }
    setMemory({ ...memory, open });
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-zinc-100">
      <section className="border-b border-white/10 bg-[linear-gradient(140deg,#0b0f14_0%,#12302f_45%,#2d1b35_100%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-12">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber">Card Table Hub</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-6xl">トランプ全部の遊び場</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-200">
              ポーカー、ブラックジャック、神経衰弱、地域ルール対応ゲームまで、スマホで切り替えて遊べるカードテーブルです。
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md border border-white/10 bg-black/30 p-3">
                <p className="text-2xl font-black text-white">{games.length}</p>
                <p className="text-xs text-zinc-400">収録</p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/30 p-3">
                <p className="text-2xl font-black text-white">{playableCount}</p>
                <p className="text-xs text-zinc-400">すぐ遊べる</p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/30 p-3">
                <p className="text-2xl font-black text-white">12+</p>
                <p className="text-xs text-zinc-400">設定項目</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/35 p-3 shadow-glow">
            <GameTable
              selectedGame={selectedGame}
              pokerHand={pokerHand}
              pokerHeld={pokerHeld}
              setPokerHeld={setPokerHeld}
              drawPoker={drawPoker}
              resetPoker={resetPoker}
              blackjack={blackjack}
              hitBlackjack={hitBlackjack}
              standBlackjack={standBlackjack}
              resetBlackjack={() => setBlackjack(newBlackjackRound(true))}
              baccarat={baccarat}
              resetBaccarat={() => setBaccarat(newBaccaratRound(true))}
              highlow={highlow}
              guessHighLow={guessHighLow}
              resetHighLow={() => setHighlow(newHighLowRound(true))}
              war={war}
              playWar={playWar}
              memory={memory}
              flipMemory={flipMemory}
              resetMemory={() => setMemory(newMemoryBoard(true))}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-md border px-3 py-2 text-sm font-bold transition ${
                  category === item
                    ? "border-amber bg-amber text-zinc-950"
                    : "border-white/10 bg-white/5 text-zinc-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visibleGames.map((game) => (
              <button
                type="button"
                key={game.id}
                onClick={() => {
                  setSelectedId(game.id);
                  setMode(game.modes[0]);
                }}
                className={`rounded-lg border p-4 text-left transition active:scale-[0.99] ${
                  selectedId === game.id
                    ? "border-amber bg-amber/10"
                    : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-black text-white">{game.name}</p>
                    <p className="mt-1 text-xs font-bold text-zinc-400">{game.category}</p>
                  </div>
                  <span
                    className={`rounded px-2 py-1 text-xs font-black ${
                      game.playable ? "bg-emerald-300 text-emerald-950" : "bg-white/10 text-zinc-300"
                    }`}
                  >
                    {game.playable ? "PLAY" : "SETUP"}
                  </span>
                </div>
                <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-300">{game.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-zinc-300">
                  <span className="rounded bg-black/30 px-2 py-1">{game.players}</span>
                  <span className="rounded bg-black/30 px-2 py-1">{game.time}</span>
                  <span className="rounded bg-black/30 px-2 py-1">{game.difficulty}</span>
                  {game.localRules && <span className="rounded bg-sky-300/15 px-2 py-1 text-sky-200">地域ルール</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber">Rule Custom</p>
              <h2 className="mt-2 text-2xl font-black text-white">{selectedGame.name}</h2>
            </div>
            <span className="rounded bg-white/10 px-2 py-1 text-xs font-bold text-zinc-300">{selectedGame.category}</span>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-bold text-zinc-300">遊び方</p>
            <div className="grid grid-cols-2 gap-2">
              {selectedGame.modes.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setMode(item)}
                  className={`rounded-md border px-3 py-2 text-sm font-bold ${
                    mode === item ? "border-sky-300 bg-sky-300 text-zinc-950" : "border-white/10 bg-black/20 text-zinc-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-sm font-bold text-zinc-300">ルール設定</p>
            {selectedGame.options.map((option) => {
              const settingKey = `${selectedGame.id}.${option.key}`;
              const value = settings[settingKey];
              if (option.type === "toggle") {
                return (
                  <label
                    key={option.key}
                    className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/20 p-3"
                  >
                    <span className="text-sm font-bold text-zinc-200">{option.label}</span>
                    <input
                      type="checkbox"
                      checked={value === true}
                      onChange={(event) => updateSetting(option.key, event.target.checked)}
                      className="h-5 w-5 accent-amber"
                    />
                  </label>
                );
              }
              return (
                <label key={option.key} className="block rounded-md border border-white/10 bg-black/20 p-3">
                  <span className="text-sm font-bold text-zinc-200">{option.label}</span>
                  <select
                    value={String(value)}
                    onChange={(event) => updateSetting(option.key, event.target.value)}
                    className="mt-2 w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white"
                  >
                    {option.choices?.map((choice) => (
                      <option key={choice}>{choice}</option>
                    ))}
                  </select>
                </label>
              );
            })}
          </div>

          <div className="mt-5 rounded-md border border-white/10 bg-[#111827] p-3">
            <p className="text-sm font-black text-white">現在のモード</p>
            <p className="mt-1 text-sm leading-6 text-zinc-300">
              {mode} / {selectedGame.playable ? "この画面ですぐ遊べます" : "ルール設定の土台を用意済み"}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function newBlackjackRound(random = false) {
  const deck = random ? shuffle(createDeck()) : createDeck();
  return {
    deck: deck.slice(4),
    player: [deck[0], deck[2]],
    dealer: [deck[1], deck[3]],
    status: "playing",
  };
}

function newBaccaratRound(random = false) {
  const deck = random ? shuffle(createDeck()) : createDeck();
  const player = [deck[0], deck[2]];
  const banker = [deck[1], deck[3]];
  return { player, banker };
}

function newHighLowRound(random = false) {
  const deck = random ? shuffle(createDeck()) : createDeck();
  return {
    current: deck[0],
    deck: deck.slice(1),
    streak: 0,
    message: "次のカードを予想",
  };
}

function newMemoryBoard(random = false) {
  const deck = random ? shuffle(createDeck()) : createDeck();
  const source = deck.slice(0, 6);
  const cards = random
    ? shuffle(source.flatMap((card) => [card, { ...card, id: `${card.id}-pair` }]))
    : source.flatMap((card) => [card, { ...card, id: `${card.id}-pair` }]);
  return { cards, open: [] as number[], matched: [] as number[], moves: 0 };
}

function ActionButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-3 text-sm font-black transition active:scale-95 ${
        variant === "primary" ? "bg-amber text-zinc-950" : "border border-white/10 bg-white/10 text-white"
      }`}
    >
      {children}
    </button>
  );
}

function GameTable(props: {
  selectedGame: Game;
  pokerHand: Card[];
  pokerHeld: string[];
  setPokerHeld: (value: string[] | ((current: string[]) => string[])) => void;
  drawPoker: () => void;
  resetPoker: () => void;
  blackjack: ReturnType<typeof newBlackjackRound>;
  hitBlackjack: () => void;
  standBlackjack: () => void;
  resetBlackjack: () => void;
  baccarat: ReturnType<typeof newBaccaratRound>;
  resetBaccarat: () => void;
  highlow: ReturnType<typeof newHighLowRound>;
  guessHighLow: (guess: "high" | "low") => void;
  resetHighLow: () => void;
  war: { player?: Card; cpu?: Card; score: number };
  playWar: () => void;
  memory: ReturnType<typeof newMemoryBoard>;
  flipMemory: (index: number) => void;
  resetMemory: () => void;
}) {
  const title = props.selectedGame.playable ? props.selectedGame.name : `${props.selectedGame.name} ルール準備`;
  return (
    <div className="min-h-[420px] rounded-md bg-[linear-gradient(160deg,#0f3b36_0%,#12302f_48%,#171923_100%)] p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber">Now Playing</p>
          <h2 className="mt-1 text-2xl font-black text-white">{title}</h2>
        </div>
        <span className="rounded bg-black/30 px-2 py-1 text-xs font-bold text-zinc-300">{props.selectedGame.time}</span>
      </div>

      {props.selectedGame.id === "poker" && (
        <div>
          <div className="flex min-h-32 flex-wrap items-end justify-center gap-2 rounded-md border border-white/10 bg-black/20 p-3">
            {props.pokerHand.map((card) => (
              <CardFace
                key={card.id}
                card={card}
                selected={props.pokerHeld.includes(card.id)}
                onClick={() =>
                  props.setPokerHeld((current) =>
                    current.includes(card.id) ? current.filter((id) => id !== card.id) : [...current, card.id],
                  )
                }
              />
            ))}
          </div>
          <div className="mt-4 rounded-md border border-white/10 bg-black/25 p-3">
            <p className="text-sm font-bold text-zinc-400">現在の役</p>
            <p className="mt-1 text-2xl font-black text-white">{evaluatePoker(props.pokerHand)}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ActionButton onClick={props.drawPoker}>選んだカードを残す</ActionButton>
            <ActionButton onClick={props.resetPoker} variant="secondary">
              配り直す
            </ActionButton>
          </div>
        </div>
      )}

      {props.selectedGame.id === "blackjack" && (
        <div className="space-y-4">
          <HandRow title={`あなた ${blackjackValue(props.blackjack.player)}`} cards={props.blackjack.player} />
          <HandRow title={`ディーラー ${blackjackValue(props.blackjack.dealer)}`} cards={props.blackjack.dealer} />
          <StatusPanel status={blackjackStatusText(props.blackjack.status)} />
          <div className="grid grid-cols-3 gap-2">
            <ActionButton onClick={props.hitBlackjack}>ヒット</ActionButton>
            <ActionButton onClick={props.standBlackjack} variant="secondary">
              スタンド
            </ActionButton>
            <ActionButton onClick={props.resetBlackjack} variant="secondary">
              新しく
            </ActionButton>
          </div>
        </div>
      )}

      {props.selectedGame.id === "baccarat" && (
        <div className="space-y-4">
          <HandRow title={`プレイヤー ${baccaratValue(props.baccarat.player)}`} cards={props.baccarat.player} />
          <HandRow title={`バンカー ${baccaratValue(props.baccarat.banker)}`} cards={props.baccarat.banker} />
          <StatusPanel status={baccaratResult(props.baccarat)} />
          <ActionButton onClick={props.resetBaccarat}>もう一度配る</ActionButton>
        </div>
      )}

      {props.selectedGame.id === "highlow" && (
        <div>
          <div className="flex justify-center rounded-md border border-white/10 bg-black/20 p-5">
            <CardFace card={props.highlow.current} />
          </div>
          <StatusPanel status={`${props.highlow.message} / 連続 ${props.highlow.streak}`} />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ActionButton onClick={() => props.guessHighLow("high")}>高い</ActionButton>
            <ActionButton onClick={() => props.guessHighLow("low")}>低い</ActionButton>
            <ActionButton onClick={props.resetHighLow} variant="secondary">
              リセット
            </ActionButton>
          </div>
        </div>
      )}

      {props.selectedGame.id === "war" && (
        <div>
          <div className="grid grid-cols-2 gap-4">
            <WarSlot title="あなた" card={props.war.player} />
            <WarSlot title="CPU" card={props.war.cpu} />
          </div>
          <StatusPanel status={`スコア ${props.war.score}`} />
          <ActionButton onClick={props.playWar}>勝負する</ActionButton>
        </div>
      )}

      {props.selectedGame.id === "memory" && (
        <div>
          <div className="grid grid-cols-4 gap-2">
            {props.memory.cards.map((card, index) => {
              const visible = props.memory.open.includes(index) || props.memory.matched.includes(index);
              return (
                <button
                  type="button"
                  key={`${card.id}-${index}`}
                  onClick={() => props.flipMemory(index)}
                  className={`flex aspect-[3/4] items-center justify-center rounded-md border text-lg font-black ${
                    visible ? "border-zinc-200 bg-zinc-50" : "border-white/10 bg-black/35"
                  }`}
                >
                  {visible ? <span className={suitInfo(card.suit).color}>{cardLabel(card)}</span> : ""}
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <StatusPanel status={`手数 ${props.memory.moves} / ペア ${props.memory.matched.length / 2}`} />
            <ActionButton onClick={props.resetMemory} variant="secondary">
              並べ直す
            </ActionButton>
          </div>
        </div>
      )}

      {!props.selectedGame.playable && (
        <div className="grid min-h-72 place-items-center rounded-md border border-white/10 bg-black/20 p-5 text-center">
          <div>
            <div className="mx-auto mb-4 flex justify-center gap-2">
              {shuffle(createDeck())
                .slice(0, 4)
                .map((card) => (
                  <CardFace key={card.id} card={card} compact />
                ))}
            </div>
            <p className="text-xl font-black text-white">設定つきモードを準備済み</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              右側のルール設定を変えると、このゲーム用の地域ルールを保存できます。次の実装で実プレイ画面に広げられる状態です。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function HandRow({ title, cards }: { title: string; cards: Card[] }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <p className="mb-2 text-sm font-black text-zinc-300">{title}</p>
      <div className="flex min-h-24 flex-wrap gap-2">
        {cards.map((card) => (
          <CardFace key={card.id} card={card} compact />
        ))}
      </div>
    </div>
  );
}

function StatusPanel({ status }: { status: string }) {
  return (
    <div className="mt-4 rounded-md border border-white/10 bg-black/25 p-3 text-sm font-black text-white">
      {status}
    </div>
  );
}

function WarSlot({ title, card }: { title: string; card?: Card }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3 text-center">
      <p className="mb-3 text-sm font-black text-zinc-300">{title}</p>
      <div className="flex justify-center">{card ? <CardFace card={card} /> : <EmptyCard label="待機" />}</div>
    </div>
  );
}

function blackjackStatusText(status: string) {
  const map: Record<string, string> = {
    playing: "カードを引くか、ここで止めるか選んでください",
    "player-bust": "21を超えました。ディーラーの勝ち",
    "player-win": "あなたの勝ち",
    "dealer-win": "ディーラーの勝ち",
    push: "引き分け",
  };
  return map[status] ?? status;
}

function baccaratResult(round: ReturnType<typeof newBaccaratRound>) {
  const player = baccaratValue(round.player);
  const banker = baccaratValue(round.banker);
  if (player === banker) return `タイ ${player} - ${banker}`;
  return player > banker ? `プレイヤー勝ち ${player} - ${banker}` : `バンカー勝ち ${banker} - ${player}`;
}
