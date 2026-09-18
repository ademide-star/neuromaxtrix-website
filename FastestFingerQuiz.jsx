// FastestFingerQuiz.jsx
//
// Drop this into your components/pages folder and add a route to it
// (e.g. /quiz/physiology-fastest-finger).
//
// SETUP:
// 1. npm install @supabase/supabase-js   (skip if already installed)
// 2. Run supabase-quiz-results-schema.sql once in your Supabase SQL editor.
// 3. If you already have a shared Supabase client (e.g. src/lib/supabaseClient.js),
//    delete the block below marked "SUPABASE CLIENT" and instead:
//      import { supabase } from '../lib/supabaseClient';
// 4. Otherwise, fill in your project URL and anon key below. Both are safe
//    to expose in frontend code — access is controlled by the RLS policy,
//    not by keeping the key secret.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import './FastestFingerQuiz.css';

// ---------- SUPABASE CLIENT ----------
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// --------------------------------------

const QUESTIONS = [
  { q: "The resting membrane potential of a typical neuron is closest to:", o: ["-70 mV", "+30 mV", "0 mV", "-150 mV"], c: 0, e: "Most neurons rest around -70 mV, mainly set by K+ permeability." },
  { q: "Which ion influx is primarily responsible for the depolarization phase of the neuronal action potential?", o: ["Na+", "K+", "Ca2+", "Cl-"], c: 0, e: "Voltage-gated Na+ channels open rapidly, driving depolarization." },
  { q: "The SA node is located in the:", o: ["Right atrium", "Left ventricle", "Interventricular septum", "Left atrium"], c: 0, e: "The sinoatrial node lies in the wall of the right atrium and is the heart's natural pacemaker." },
  { q: "Cardiac output is the product of heart rate and:", o: ["Stroke volume", "Blood pressure", "Ejection time", "Venous return"], c: 0, e: "CO = HR x SV." },
  { q: "Which chamber of the heart has the thickest muscular wall?", o: ["Left ventricle", "Right ventricle", "Left atrium", "Right atrium"], c: 0, e: "It pumps blood to the systemic circulation against high resistance." },
  { q: "The primary site of gas exchange in the lungs is the:", o: ["Alveoli", "Bronchi", "Trachea", "Bronchioles"], c: 0, e: "Alveoli provide the thin, large surface area needed for O2/CO2 exchange." },
  { q: "Which muscle is the major muscle of quiet inspiration?", o: ["Diaphragm", "External intercostals", "Rectus abdominis", "Sternocleidomastoid"], c: 0, e: "Diaphragm contraction increases thoracic volume, driving normal inspiration." },
  { q: "Functional residual capacity equals:", o: ["Expiratory reserve volume + residual volume", "Tidal volume + inspiratory reserve volume", "Vital capacity + residual volume", "Tidal volume alone"], c: 0, e: "FRC = ERV + RV, the air left in lungs after normal expiration." },
  { q: "The functional unit of the kidney is the:", o: ["Nephron", "Glomerulus", "Renal pyramid", "Bowman's capsule"], c: 0, e: "Each nephron carries out filtration, reabsorption, and secretion." },
  { q: "Most filtered water and solutes are reabsorbed in the:", o: ["Proximal convoluted tubule", "Distal convoluted tubule", "Loop of Henle descending limb only", "Collecting duct"], c: 0, e: "About 65-70% of filtrate is reabsorbed here." },
  { q: "Antidiuretic hormone (ADH) acts mainly on the:", o: ["Collecting duct", "Glomerulus", "Proximal tubule", "Loop of Henle ascending limb"], c: 0, e: "ADH increases water permeability of the collecting duct via aquaporins." },
  { q: "Which hormone is secreted in response to low blood calcium?", o: ["Parathyroid hormone", "Calcitonin", "Insulin", "Glucagon"], c: 0, e: "PTH raises blood Ca2+ by acting on bone, kidney, and gut." },
  { q: "Insulin is secreted by which pancreatic cells?", o: ["Beta cells", "Alpha cells", "Delta cells", "Acinar cells"], c: 0, e: "Beta cells of the islets of Langerhans secrete insulin." },
  { q: "Which enzyme initiates protein digestion in the stomach?", o: ["Pepsin", "Trypsin", "Amylase", "Lipase"], c: 0, e: "Pepsin, activated from pepsinogen by HCl, begins protein breakdown." },
  { q: "Bile is produced by the liver and stored in the:", o: ["Gallbladder", "Pancreas", "Duodenum", "Spleen"], c: 0, e: "Bile is concentrated and stored in the gallbladder before release." },
  { q: "The normal average adult resting heart rate is about:", o: ["60-100 bpm", "40-50 bpm", "120-150 bpm", "20-40 bpm"], c: 0, e: "60-100 bpm is the accepted normal adult resting range." },
  { q: "Erythropoietin, which stimulates red blood cell production, is mainly produced by the:", o: ["Kidney", "Liver", "Spleen", "Bone marrow"], c: 0, e: "The kidney produces most EPO in response to hypoxia." },
  { q: "Which blood cells are primarily responsible for oxygen transport?", o: ["Erythrocytes", "Leukocytes", "Platelets", "Plasma cells"], c: 0, e: "Red blood cells carry hemoglobin, which binds and transports oxygen." },
  { q: "The universal blood donor blood type is:", o: ["O negative", "AB positive", "A positive", "B negative"], c: 0, e: "O negative lacks A, B, and Rh antigens, minimizing reaction risk." },
  { q: "Which part of the brain regulates body temperature, hunger, and thirst?", o: ["Hypothalamus", "Cerebellum", "Medulla oblongata", "Thalamus"], c: 0, e: "The hypothalamus is the key homeostatic control center." },
  { q: "The neurotransmitter released at the neuromuscular junction is:", o: ["Acetylcholine", "Dopamine", "Serotonin", "GABA"], c: 0, e: "ACh binds nicotinic receptors on skeletal muscle to trigger contraction." },
  { q: "During muscle contraction, calcium binds to which protein to expose myosin-binding sites?", o: ["Troponin", "Tropomyosin", "Actin", "Titin"], c: 0, e: "Ca2+ binding to troponin shifts tropomyosin, exposing binding sites on actin." },
  { q: "Which type of muscle fiber is most resistant to fatigue?", o: ["Type I (slow oxidative)", "Type IIx (fast glycolytic)", "Type IIb", "Cardiac only"], c: 0, e: "Slow oxidative fibers rely on aerobic metabolism, giving high endurance." },
  { q: "Which hormone from the adrenal medulla prepares the body for fight or flight?", o: ["Adrenaline (epinephrine)", "Aldosterone", "Cortisol", "Testosterone"], c: 0, e: "Epinephrine increases heart rate, blood glucose, and blood flow to muscles." },
  { q: "The normal pH range of arterial blood is:", o: ["7.35-7.45", "6.80-7.00", "7.60-7.80", "7.00-7.20"], c: 0, e: "Blood pH is tightly regulated between 7.35 and 7.45." },
  { q: "Which respiratory center in the brainstem sets the basic rhythm of breathing?", o: ["Medullary respiratory center", "Cerebellum", "Hypothalamus", "Occipital lobe"], c: 0, e: "The medulla oblongata generates the basic rhythmic pattern of breathing." },
  { q: "Which hormone triggers ovulation via a mid-cycle surge?", o: ["Luteinizing hormone (LH)", "Follicle-stimulating hormone (FSH)", "Progesterone", "Prolactin"], c: 0, e: "An LH surge triggers rupture of the mature follicle at ovulation." },
  { q: "Baroreceptors that help regulate blood pressure are mainly located in the:", o: ["Carotid sinus and aortic arch", "Kidney cortex", "Liver sinusoids", "Spleen"], c: 0, e: "These stretch receptors detect blood pressure changes and signal the medulla." },
  { q: "Which gas exchange process describes movement of O2 from alveoli to blood?", o: ["Diffusion", "Active transport", "Osmosis", "Filtration"], c: 0, e: "O2 moves passively down its concentration gradient by simple diffusion." },
  { q: "The Bohr effect describes how increased CO2 and decreased pH affect hemoglobin's affinity for:", o: ["Oxygen (decreases affinity)", "Carbon monoxide (increases affinity)", "Nitrogen (no change)", "Glucose"], c: 0, e: "Higher CO2 and lower pH shift the O2-hemoglobin curve right, favoring O2 release to tissues." },
];

const DURATION = 20; // seconds per question

function shuffleQuestion(q) {
  const idx = [0, 1, 2, 3];
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return { q: q.q, e: q.e, o: idx.map((i) => q.o[i]), c: idx.indexOf(q.c) };
}

export default function FastestFingerQuiz() {
  const [stage, setStage] = useState('start'); // start | quiz | results | saving | saved | save_error
  const [name, setName] = useState('');
  const [deck, setDeck] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [answered, setAnswered] = useState(false);
  const [chosenIdx, setChosenIdx] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const deadlineRef = useRef(0);
  const intervalRef = useRef(null);
  const liquidRef = useRef(null);

  const startQuiz = () => {
    const trimmed = name.trim();
    setName(trimmed || 'Anonymous');
    setDeck(QUESTIONS.map(shuffleQuestion));
    setCurrent(0);
    setScore(0);
    setCorrectCount(0);
    setResponseTimes([]);
    setStage('quiz');
  };

  const runTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    deadlineRef.current = Date.now() + DURATION * 1000;
    setSecondsLeft(DURATION);
    if (liquidRef.current) {
      liquidRef.current.style.transition = 'none';
      liquidRef.current.style.height = '100%';
      void liquidRef.current.offsetHeight;
      liquidRef.current.style.transition = `height ${DURATION}s linear`;
      liquidRef.current.style.height = '0%';
    }
    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, deadlineRef.current - Date.now());
      setSecondsLeft(Math.ceil(remaining / 1000));
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (stage !== 'quiz' || !deck.length) return;
    setAnswered(false);
    setChosenIdx(null);
    setFeedback(null);
    runTimer();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, stage, deck]);

  useEffect(() => {
    if (stage === 'quiz' && secondsLeft <= 0 && !answered) {
      handleAnswer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const handleAnswer = (i) => {
    if (answered) return;
    setAnswered(true);
    clearInterval(intervalRef.current);

    const remainingMs = Math.max(0, deadlineRef.current - Date.now());
    const remainingSec = remainingMs / 1000;
    const item = deck[current];
    const isCorrect = i !== null && i === item.c;

    setResponseTimes((prev) => [...prev, DURATION - remainingSec]);
    setChosenIdx(i);

    let points = 0;
    if (isCorrect) {
      points = Math.max(10, Math.round(100 * (remainingSec / DURATION)));
      setScore((s) => s + points);
      setCorrectCount((c) => c + 1);
    }
    setFeedback({
      head: i === null ? "Time's up — 0 pts." : isCorrect ? `Correct — +${points} pts.` : 'Not quite.',
      text: item.e,
    });

    const isLast = current === deck.length - 1;
    setTimeout(() => {
      if (isLast) {
        setStage('results');
      } else {
        setCurrent((c) => c + 1);
      }
    }, isLast ? 1600 : 1400);
  };

  const avgResponse = responseTimes.length
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;

  const saveResults = async () => {
    setStage('saving');
    const { error } = await supabase.from('quiz_results').insert({
      quiz_name: 'Fastest Finger First: Physiology',
      student_name: name,
      score,
      correct: correctCount,
      total: deck.length,
      avg_response_seconds: Number(avgResponse.toFixed(2)),
    });
    setStage(error ? 'save_error' : 'saved');
  };

  const restart = () => {
    setName('');
    setStage('start');
  };

  return (
    <div className="ffq-stage">
      <div className="ffq-brand">
        <h1>
          Physiology &nbsp;·&nbsp; <b>Fastest Finger First</b>
        </h1>
        <div className="ffq-tag">20s / question</div>
      </div>

      <div className="ffq-card">
        {stage === 'start' && (
          <div className="ffq-start">
            <h2>Fastest Finger First</h2>
            <p>Thirty physiology questions, twenty seconds each. Answer fast — your score rewards speed as well as accuracy.</p>
            <div className="ffq-rules">
              <div><span className="n">30</span><span className="l">questions</span></div>
              <div><span className="n">20s</span><span className="l">per question</span></div>
              <div><span className="n">1-4</span><span className="l">or click</span></div>
            </div>
            <input
              className="ffq-nameinput"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="ffq-primary" onClick={startQuiz}>Start quiz</button>
          </div>
        )}

        {stage === 'quiz' && deck.length > 0 && (
          <div className="ffq-quiz">
            <div className="ffq-qhead">
              <div className="ffq-qcount">Q <b>{current + 1}</b> / {deck.length}</div>
              <div className="ffq-progress">
                <i style={{ width: `${(current / deck.length) * 100}%` }} />
              </div>
            </div>

            <div className="ffq-timerwrap">
              <div className="ffq-burette"><div className="liquid" ref={liquidRef} /></div>
              <div>
                <div className="ffq-timenum" style={{ color: secondsLeft <= 5 ? 'var(--danger)' : undefined }}>
                  {secondsLeft}
                </div>
                <div className="ffq-timelabel">seconds left</div>
              </div>
            </div>

            <div className="ffq-question">{deck[current].q}</div>

            <div className="ffq-options">
              {deck[current].o.map((text, i) => {
                const letters = ['A', 'B', 'C', 'D'];
                let cls = 'ffq-opt';
                if (answered) {
                  if (i === deck[current].c) cls += ' correct';
                  else if (i === chosenIdx) cls += ' wrong';
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    disabled={answered}
                    onClick={() => handleAnswer(i)}
                  >
                    <span className="k">{letters[i]}</span>
                    <span>{text}</span>
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className="ffq-feedback show">
                <b>{feedback.head}</b> {feedback.text}
              </div>
            )}
          </div>
        )}

        {(stage === 'results' || stage === 'saving' || stage === 'saved' || stage === 'save_error') && (
          <div className="ffq-results">
            <h2>Session complete</h2>
            <div className="sub">
              {correctCount / deck.length >= 0.8
                ? 'Sharp and fast — strong grasp of the material.'
                : correctCount / deck.length >= 0.5
                ? 'Solid pace — a few topics worth a second look.'
                : 'Good first pass — review the missed topics and run it again.'}
            </div>
            <div className="ffq-scoreline">
              <div><span className="v">{score}</span><span className="l">points</span></div>
              <div><span className="v">{correctCount}/{deck.length}</span><span className="l">correct</span></div>
              <div><span className="v">{avgResponse.toFixed(1)}s</span><span className="l">avg response</span></div>
            </div>

            {stage === 'results' && (
              <button className="ffq-primary" onClick={saveResults} style={{ marginBottom: 10 }}>
                Submit results
              </button>
            )}
            {stage === 'saving' && (
              <button className="ffq-primary" disabled style={{ marginBottom: 10 }}>Submitting…</button>
            )}
            {stage === 'saved' && (
              <div className="ffq-feedback show" style={{ marginBottom: 10 }}>
                <b>Submitted.</b> Your results have been recorded.
              </div>
            )}
            {stage === 'save_error' && (
              <>
                <div className="ffq-feedback show" style={{ marginBottom: 10 }}>
                  <b>Couldn't submit.</b> Check your connection and try again.
                </div>
                <button className="ffq-primary" onClick={saveResults} style={{ marginBottom: 10 }}>
                  Retry submit
                </button>
              </>
            )}

            <button className="ffq-ghost" onClick={restart}>Run it again</button>
          </div>
        )}
      </div>
    </div>
  );
}
