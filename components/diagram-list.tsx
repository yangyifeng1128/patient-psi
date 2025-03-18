'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { getCCDResult, getCCDTruth, saveCCDResult, saveCCDTruth } from '@/app/actions';
import {
  diagramCCD,
  diagramDescriptionMapping,
  diagramRelated,
  diagramTitleMapping,
} from '@/app/api/data/diagram-fields';
import { initialProfile, PatientProfile } from '@/app/api/data/patient-profiles';
import { sessionInstructions } from '@/app/api/data/session-instruction';
import { CCDResult, CCDTruth } from '@/lib/types';
import { CheckboxReactHookFormMultiple } from './diagram-checkbox';
import { Button } from './ui/button';

// Before
async function fetchPatientProfile(setPatientProfile: (patientProfile: PatientProfile) => void) {
  try {
    fetch('/api/profile')
      .then((response) =>
        response.json().then((data) => {
          setPatientProfile(data.profile);
        }),
      )
      .catch((error) => {
        console.log(error);
      });
  } catch {
    console.log('error fetching patient profile');
  }
}

async function fetchPatientType(userId: string, chatId: string, setPatientType: (patientType: string) => void) {
  try {
    fetch(`/api/type?userId=${userId}&chatId=${chatId}`)
      .then((response) =>
        response.json().then((data) => {
          setPatientType(data.type);
        }),
      )
      .catch((error) => {
        console.log(error);
      });
  } catch {
    console.log('error fetching patient type');
  }
}

interface DiagramListProps {
  userId: string;
  chatId: string;
  patientProfile: PatientProfile;
}

export type InputValues = {
  [key: string]: string | { id: string; label: string }[];
  checkedHelpless: { id: string; label: string }[];
  checkedUnlovable: { id: string; label: string }[];
  checkedWorthless: { id: string; label: string }[];
  checkedEmotion: { id: string; label: string }[];
};

export function DiagramList({ userId, chatId }: DiagramListProps) {
  const t = useTranslations('components.diagramList.data');

  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(initialProfile);
  const [isFetchedPatientProfile, setIsFetchedPatientProfile] = useState(false);
  const [savedCCDTruth, setSavedCCDTruth] = useState<CCDTruth | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSavedCCDResult] = useState<CCDResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [patientType, setPatientType] = useState('');
  const initialInputValues: InputValues = {
    ...Object.fromEntries([...diagramRelated, ...diagramCCD].map((name) => [name, ''])),
    checkedHelpless: [],
    checkedUnlovable: [],
    checkedWorthless: [],
    checkedEmotion: [],
  };

  const [inputValues, setInputValues] = useState<InputValues>(initialInputValues);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isFetchedPatientProfile) {
        await fetchPatientProfile(setPatientProfile);
        await fetchPatientType(userId, chatId, setPatientType);
        setIsFetchedPatientProfile(true);
      }
    };

    fetchProfile();
  }, [chatId, isFetchedPatientProfile, userId]);

  useEffect(() => {
    const fetchSavedCCDResult = async () => {
      setIsLoading(true);
      const savedResult = await getCCDResult(userId, chatId);
      if (savedResult) {
        setSavedCCDResult(savedResult);
        setInputValues((prevValues) => ({
          ...prevValues,
          ...Object.keys(savedResult).reduce((acc, key) => {
            acc[key] = savedResult[key] as string | { id: string; label: string }[];
            return acc;
          }, {} as InputValues),
        }));
        console.log('show previous ccdresult');
      }
      setIsLoading(false);
    };

    fetchSavedCCDResult();
  }, [userId, chatId]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isFetchedPatientProfile) {
        await fetchPatientProfile(setPatientProfile);
        setIsFetchedPatientProfile(true);
      }
    };

    fetchProfile();
  }, [isFetchedPatientProfile]);

  useEffect(() => {
    // Check if ccdTruth already exists in KV database
    const fetchCCDTruth = async () => {
      const existingCCDTruth = await getCCDTruth(userId, chatId);
      console.log(userId, chatId);

      if (!existingCCDTruth) {
        // If ccdTruth is not in database, save ccdTruth according to current patientProfile
        const ccdTruth: CCDTruth = {
          userId: userId,
          chatId: chatId,
          createdAt: new Date(),
          relatedHistory: patientProfile?.history ?? '',
          Helpless: patientProfile?.helpless_belief ?? [''],
          Unlovable: patientProfile?.unlovable_belief ?? [''],
          Worthless: patientProfile?.worthless_belief ?? [''],
          intermediateBelief: patientProfile?.intermediate_belief ?? '',
          intermediateBeliefDepression: patientProfile?.intermediate_belief_depression ?? '',
          copingStrategies: patientProfile?.coping_strategies ?? '',
          situation: patientProfile?.situation ?? '',
          autoThought: patientProfile?.auto_thought ?? '',
          Emotion: patientProfile?.emotion ?? [''],
          behavior: patientProfile?.behavior ?? '',
        };
        await saveCCDTruth(ccdTruth);
        setSavedCCDTruth(ccdTruth);
        console.log('CCD truth saved successfully');
      } else {
        setSavedCCDTruth(existingCCDTruth);
        console.log('CCD truth already in KV database');
      }
    };

    fetchCCDTruth();
  }, [userId, chatId, patientProfile]);

  if (isLoading) {
    return <div>{'Loading...'}</div>; // or any loading indicator
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>, name: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: event.target.value,
    }));
    console.log(inputValues);
  };

  const handleCheckboxChange = (category: string, checkedValues: { id: string; label: string }[]) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [`checked${category}`]: checkedValues,
    }));
  };

  const handleSubmit = async () => {
    try {
      const ccdResult: CCDResult = {
        userId: userId,
        chatId: chatId,
        createdAt: new Date(),
        checkedHelpless: inputValues['checkedHelpless'] as [],
        checkedUnlovable: inputValues['checkedUnlovable'] as [],
        checkedWorthless: inputValues['checkedWorthless'] as [],
        intermediateBelief: inputValues['intermediateBelief'] as string,
        intermediateBeliefDepression: inputValues['intermediateBeliefDepression'] as string,
        copingStrategies: inputValues['copingStrategies'] as string,
        situation: inputValues['situation'] as string,
        autoThought: inputValues['autoThought'] as string,
        checkedEmotion: inputValues['checkedEmotion'] as [],
        behavior: inputValues['behavior'] as string,
      };
      await saveCCDResult(ccdResult);
      console.log('CCD results saved successfully');
      console.log(ccdResult);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error saving input values to KV database:', error);
    }
  };

  if (!savedCCDTruth) {
    return false;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 px-5">
        <h4 className="text-lg font-bold">{'Patient Intake and Cognitive Conceptualization Diagram'}</h4>
      </div>
      <div className="mb-2 space-y-6 overflow-auto px-5">
        <label className="block pt-1 font-medium leading-normal">
          <span className="font-bold">
            {'Patient Type: '}
            {patientType}
          </span>
        </label>
        <div className="-mb-4">
          <label className="block text-base font-bold text-blue-600">
            {diagramTitleMapping['relatedHistory']}
            {':'}
          </label>
        </div>
        <p className="font-medium leading-normal text-blue-600">{savedCCDTruth?.relatedHistory}</p>
        <label className="block pt-1 font-medium leading-normal text-red-500">
          <span className="font-bold">{'The expected time of the session is around 10 minutes.'}</span>
        </label>
        <label className="block pt-1 font-medium leading-normal">
          <span className="font-bold">{'Instructions: '}</span>
          {sessionInstructions['ccd-situation']}
        </label>
        {diagramCCD.map((name) => (
          <div key={name}>
            <label className="mb-1 block text-base font-bold">{diagramTitleMapping[name]}</label>
            <label className="block pt-1 text-sm font-medium leading-6 text-zinc-500">
              {diagramDescriptionMapping[name]}
            </label>
            {name == 'emotion' ? (
              <div className="mt-2 flex flex-col items-start space-y-2">
                {['Emotion'].map((category, index) => (
                  <div className="mt-2 flex flex-col items-start space-y-2" key={category}>
                    <CheckboxReactHookFormMultiple
                      category={category}
                      checkboxValues={inputValues[`checked${category}`] as []}
                      key={`${category}-${index}`}
                      onCheckboxChange={handleCheckboxChange}
                    />
                    {isSubmitted && (
                      <label className="block font-medium leading-normal text-blue-600">
                        <span className="font-bold">{'Reference:'}</span>
                        {savedCCDTruth?.['Emotion']?.map((item: string, index: number) => (
                          <div className="pt-1 leading-normal text-blue-600" key={index}>
                            {item}
                          </div>
                        ))}
                      </label>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 flex flex-col items-start space-y-2">
                <textarea
                  className="focus:shadow-outline-blue h-[80px] w-full appearance-none rounded-md border px-3 py-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:text-gray-200"
                  onChange={(event) => handleChange(event, name)}
                  value={inputValues[name] as string} // Ensure fallback to prevent undefined value
                />

                {isSubmitted && (
                  <label className="block pt-1 font-medium leading-normal text-blue-600" key={name}>
                    <span className="font-bold">{'Reference: '}</span>
                    {savedCCDTruth?.[name] as string}
                  </label>
                )}
              </div>
            )}
          </div>
        ))}
        <hr className="my-4 border-gray-300" />
        <label className="block pt-4 font-medium leading-normal">
          <span className="font-bold">{'Instructions: '}</span> {sessionInstructions['ccd']}
        </label>
        {diagramRelated.map((name) => (
          <div key={name}>
            <label className="mb-1 block text-base font-bold">{diagramTitleMapping[name]}</label>
            <label className="block pt-1 text-sm font-medium leading-6 text-zinc-500">
              {diagramDescriptionMapping[name]}
            </label>
            {name == 'coreBelief' ? (
              <div className="mt-2">
                {['Helpless', 'Unlovable', 'Worthless'].map((category, index) => (
                  <div className="mt-2 flex flex-col items-start space-y-2" key={category}>
                    <CheckboxReactHookFormMultiple
                      category={category}
                      checkboxValues={inputValues[`checked${category}`] as []}
                      key={`${category}-${index}`}
                      onCheckboxChange={handleCheckboxChange}
                    />
                    {isSubmitted && (
                      <label className="block font-medium leading-normal text-blue-600">
                        <span className="font-bold">{'Reference:'}</span>
                        {(savedCCDTruth?.[category] as string[])?.length === 0 ? (
                          <div className="pt-1 leading-normal text-blue-600">{'not chosen'}</div>
                        ) : (
                          (savedCCDTruth?.[category] as string[])?.map((item: string, index: number) => (
                            <div className="pt-1 leading-normal text-blue-600" key={index}>
                              {item}
                            </div>
                          ))
                        )}
                      </label>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 flex flex-col items-start space-y-2">
                <textarea
                  className="focus:shadow-outline-blue h-[80px] w-full appearance-none rounded-md border px-3 py-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:text-gray-200"
                  onChange={(event) => handleChange(event, name)}
                  value={inputValues[name] as string} // Ensure fallback to prevent undefined value
                />

                {isSubmitted && (
                  <label className="block pt-1 font-medium leading-normal text-blue-600" key={name}>
                    <span className="font-bold">{'Reference: '}</span>
                    {savedCCDTruth?.[name] as string}
                  </label>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end p-4">
        <Button onClick={handleSubmit}>{t('submitAndReviewAnswers')}</Button>
      </div>
    </div>
  );
}
