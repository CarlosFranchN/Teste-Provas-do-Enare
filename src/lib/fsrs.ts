import { Flashcard, FSRSRating, FSRSCardState } from '../types';

export interface FSRSForecast {
  intervalDays: number;
  label: string;
  nextDate: Date;
}

/**
 * Format interval duration into human-readable Portuguese representation
 */
export function formatInterval(days: number): string {
  if (days < 1 / 24) {
    const minutes = Math.max(1, Math.round(days * 24 * 60));
    return `${minutes} min`;
  }
  if (days < 1) {
    const hours = Math.round(days * 24);
    return `${hours}h`;
  }
  const roundedDays = Math.round(days);
  if (roundedDays === 1) {
    return '1 dia';
  }
  if (roundedDays < 30) {
    return `${roundedDays} dias`;
  }
  const months = Math.round(roundedDays / 30);
  return months === 1 ? '1 mês' : `${months} meses`;
}

/**
 * Calculate the next FSRS parameters for a given card and user rating.
 * Rating:
 * 1 = Novamente (Again)
 * 2 = Difícil (Hard)
 * 3 = Bom (Good)
 * 4 = Fácil (Easy)
 */
export function calculateNextFSRS(card: Flashcard, rating: FSRSRating): {
  stability: number;
  difficulty: number;
  interval: number;
  state: FSRSCardState;
  due_date: string;
  reps: number;
  lapses: number;
} {
  let stability = card.stability || 1;
  let difficulty = card.difficulty || 5;
  let lapses = card.lapses || 0;
  let reps = card.reps || 0;
  let state: FSRSCardState = card.state || 'new';

  const isFirstReview = card.reps === 0;

  if (isFirstReview) {
    switch (rating) {
      case 1: // Again
        difficulty = 7.5;
        stability = 0.4; // 10 minutes approx (0.007 days)
        break;
      case 2: // Hard
        difficulty = 6.2;
        stability = 1.2; // ~1 day
        break;
      case 3: // Good
        difficulty = 4.8;
        stability = 3.2; // ~3 days
        break;
      case 4: // Easy
        difficulty = 3.2;
        stability = 8.0; // ~8 days
        break;
    }
  } else {
    // Repeated reviews (FSRS algorithm formulation)
    switch (rating) {
      case 1: // Again
        lapses += 1;
        difficulty = Math.min(10, difficulty + 1.2);
        stability = Math.max(0.3, stability * 0.25);
        state = 'relearning';
        break;
      case 2: // Hard
        difficulty = Math.min(10, difficulty + 0.4);
        stability = Math.max(1.0, stability * 1.3);
        state = 'review';
        break;
      case 3: // Good
        difficulty = Math.max(1.0, difficulty - 0.2);
        stability = Math.max(2.5, stability * 2.2);
        state = 'review';
        break;
      case 4: // Easy
        difficulty = Math.max(1.0, difficulty - 0.8);
        stability = Math.max(6.0, stability * 3.2);
        state = 'review';
        break;
    }
  }

  // Calculate actual interval in days
  let interval: number;
  if (rating === 1) {
    // 10 minutes interval
    interval = 10 / (24 * 60); // ~0.00694 days
    state = lapses > 0 ? 'relearning' : 'learning';
  } else if (rating === 2) {
    interval = Math.max(1, Math.round(stability * 0.85));
  } else if (rating === 3) {
    interval = Math.max(2, Math.round(stability * 1.05));
  } else {
    // Easy
    interval = Math.max(4, Math.round(stability * 1.35));
  }

  if (rating > 1) {
    reps += 1;
  }

  const nextDate = new Date();
  if (interval < 1) {
    nextDate.setMinutes(nextDate.getMinutes() + 10);
  } else {
    nextDate.setDate(nextDate.getDate() + interval);
    // Standardize to start of morning review
    nextDate.setHours(7, 0, 0, 0);
  }

  return {
    stability: Number(stability.toFixed(2)),
    difficulty: Number(difficulty.toFixed(2)),
    interval: Number(interval.toFixed(3)),
    state,
    due_date: nextDate.toISOString(),
    reps,
    lapses,
  };
}

/**
 * Get the forecasted interval for all 4 ratings for a given card
 */
export function getForecastIntervals(card: Flashcard): Record<FSRSRating, FSRSForecast> {
  const ratings: FSRSRating[] = [1, 2, 3, 4];
  const forecasts = {} as Record<FSRSRating, FSRSForecast>;

  ratings.forEach((rating) => {
    const next = calculateNextFSRS(card, rating);
    const nextDate = new Date(next.due_date);
    forecasts[rating] = {
      intervalDays: next.interval,
      label: formatInterval(next.interval),
      nextDate,
    };
  });

  return forecasts;
}

/**
 * Check if a card is currently due for review
 */
export function isCardDue(card: Flashcard): boolean {
  return new Date(card.due_date).getTime() <= Date.now();
}
