/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { HUGGING_FACE_KEY } from './credentials';
import { sortStringsByFloats } from './stringUtils';

/**
 * Use hugging face to get sentence similarity metrics
 * @param data
 * @returns
 */
const querySimilarity = async (data: {
  inputs: { source_sentence: string; sentences: string[] };
}): Promise<number[]> => {
  const response = await fetch('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', {
    headers: { Authorization: 'Bearer ' + HUGGING_FACE_KEY },
    method: 'POST',
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result as number[];
};

export const chooseCollectionGivenQuestion = async (question: string, sitesData: any, pagesData: any) => {
  const choices = ['question about site info', 'question about a page'];

  const siteOrPagePredictions = await querySimilarity({
    inputs: {
      source_sentence: question.toLowerCase(),
      sentences: choices,
    },
  });

  const sortedPredictions: string[] = sortStringsByFloats(choices, siteOrPagePredictions);
  const chosenCollection = sortedPredictions[0];

  const info_results = { data: [], type: '' };
  if (chosenCollection === 'question about site info') {
    info_results.data = sitesData.sitesData;
    info_results.type = 'sites';
  }
  if (chosenCollection === 'question about a page') {
    info_results.data = pagesData.pagesData;
    info_results.type = 'pages';
  }
  return info_results;
};

const getRandomDataSource = (sitesData: any, pagesData: any) => {
  let choices = [];

  const site = { data: sitesData['sitesData'], type: 'sites' };

  const page = { data: pagesData['pagesData'], type: 'pages' };
  choices = [site, page];

  return choices[Math.floor(Math.random() * choices.length)];
};

export const getAIAnswer = async (
  info_results: any,
  question: string,
  token: string,
  sitesData: any,
  pagesData: any,
) => {
  const resp = await fetch('/api/ai:ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question, info: info_results, nextQDataSource: getRandomDataSource(sitesData, pagesData) }),
  });

  const { data } = await resp.json();
  return data;
};
