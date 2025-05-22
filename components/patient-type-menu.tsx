'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { initialProfile, PatientProfile } from '@/app/api/data/patient-profiles';
import { patientTypeDescriptions, patientTypes } from '@/app/api/data/patient-types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Call api/prompt/GET to fetch patient profile
async function fetchPatientProfile(
  setIsStarted: (isStarted: boolean) => void,
  setPatientProfile: (patientProfile: PatientProfile) => void,
) {
  try {
    fetch('/api/prompt')
      .then((response) =>
        response.json().then((data) => {
          setIsStarted(true);
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

interface PatientTypeListProps {
  readonly typeList: string[];
  selectedType?: string;
  handleChoiceClick: (choice: string) => void;
}

const PatientTypeDropdownList: React.FC<PatientTypeListProps> = ({ typeList, selectedType, handleChoiceClick }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative flex w-[10rem] items-center gap-x-1.5 rounded-md bg-background py-1.5 pl-3 pr-10 text-left text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-gray-900 hover:bg-accent hover:text-accent-foreground dark:text-white dark:ring-white">
          <div className="grow text-left">{selectedType}</div>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg aria-hidden="true" className="-mr-1 size-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                fillRule="evenodd"
              />
            </svg>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="focus:outline-none] absolute z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
        sideOffset={8}
      >
        <div className="max-h-90 overflow-y-auto">
          {typeList.map((choice, index) => (
            <DropdownMenuItem className="flex-col items-start" key={index} onClick={() => handleChoiceClick(choice)}>
              <div className="text-sm font-medium">{choice}</div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface PatientTypeMenuProps {
  onStartedChange: (isStarted: boolean) => void;
  onSetPatientProfile: (selectedPatientName: PatientProfile) => void;
}

export function PatientTypeMenu({ onStartedChange, onSetPatientProfile }: PatientTypeMenuProps) {
  const t = useTranslations('components.patientTypeMenu.data');

  const patientTypeListValues: string[] = patientTypes.map(({ type }) => type);

  const [selectedType, setSelectedType] = useState('员工类型');
  const [selectedTypeDescription, setSelectedTypeDescription] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(initialProfile);

  useEffect(() => {
    onStartedChange(isStarted);
  }, [isStarted, onStartedChange]);

  useEffect(() => {
    onSetPatientProfile(patientProfile);
  }, [patientProfile, onSetPatientProfile]);

  const handleChoiceClick = (choice: string) => {
    setSelectedType(choice);
    const typeDescription = patientTypeDescriptions.find((description) => description.type === choice);
    if (typeDescription) {
      setSelectedTypeDescription(typeDescription.content);
    }
  };

  const handleStartButtonClick = async () => {
    const isValidType = patientTypes.some((type) => type.type === selectedType);
    if (isValidType && selectedType) {
      // const selectedPatientTypeContent = patientTypes.find((item) => item.type === selectedType)?.content;
      console.log(selectedType);
      try {
        const response = await fetch('/api/prompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ patientType: selectedType }),
        });
        if (response.ok) {
          console.log('patient type submitted.');
        } else {
          console.log('error sending patient type to server');
        }
      } catch (error) {
        console.log(error);
      }
      fetchPatientProfile(setIsStarted, setPatientProfile);
    } else {
      alert('Please select a valid patient type.');
    }
  };

  return (
    <div>
      {!isStarted ? (
        <div>
          <p className="pt-4 font-medium leading-normal text-zinc-500">
            {
              '本产品是一款与AI模拟的心理困扰员工进行CBT认知行为疗法对话的实训平台，以帮助企业EAP从业者更好地开展心理援助工作。'
            }
          </p>
          <p className="pt-4 font-medium leading-normal text-zinc-500">
            {
              '在对话过程中，您将与一位由AI模拟的、拥有虚拟人设的员工进行交谈。您的目标是通过与员工沟通并运用CBT认知行为疗法技能，识别员工的认知概念图。'
            }
          </p>
          <p className="pt-4 font-medium leading-normal text-zinc-500">
            {
              '我们提供了6种典型的员工类型，分别是：直白型、易怒/抵触型、话多/滔滔不绝型、拘谨/惜字如金型、容易跑题型、过度迎合/取悦型。'
            }
          </p>
          <div className="max-w-6xl px-0">
            <div>
              <label className="block pt-4 text-sm font-medium leading-6">{'请选择一种员工类型'}</label>
              <div className="flex items-center justify-start">
                <div>
                  <PatientTypeDropdownList
                    handleChoiceClick={handleChoiceClick}
                    selectedType={selectedType}
                    typeList={patientTypeListValues}
                  ></PatientTypeDropdownList>
                </div>
              </div>
            </div>
            {selectedType !== '' && (
              <div>
                <p className="block pt-5 font-medium leading-6">{selectedTypeDescription}</p>
                {!isStarted && (
                  <div className="block pt-5">
                    <Button className="w-[10rem]" onClick={handleStartButtonClick}>
                      {t('startConversation')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
