export const diagramDescriptionMapping: { [key: string]: string } = {
  relatedHistory:
    'Please capture important background information about the client, such as significant life events or circumstances that may have contributed to their current mental state or behavior.',
  coreBelief:
    'Please select any core beliefs that match the your understanding of the client under the following three categories: Hopeless, Unlovable, and Worthless Core beliefs.',
  intermediateBelief: '请描述影响员工对自己、他人和周围世界的看法的中间信念',
  intermediateBeliefDepression:
    "Please identify how the client's intermediate beliefs change and become more negative during episodes of depression, if applicable",
  copingStrategies: '请描述员工管理情绪的应对策略',
  situation: '请记录来访者近期遇到的导致消极自动思维和情绪困扰的具体情况或触发因素。',
  autoThought:
    "Please record the client's immediate, unfiltered thoughts that arise in response to the identified situation.",
  emotion:
    'Please select any emotions experienced by the client in relation to the situation and their automatic thoughts.',
  behavior:
    "Please describe the client's behavioral responses and actions taken as a result of their automatic thoughts and emotions in the given situation.",
};

export const diagramTitleMapping: { [key: string]: string } = {
  relatedHistory: '过往经历',
  coreBelief: '核心信念',
  intermediateBelief: '中间信念',
  intermediateBeliefDepression: '抑郁期间的中间信念',
  copingStrategies: '应对策略',
  situation: '处境',
  autoThought: '自动思维',
  emotion: '情绪',
  behavior: '行为',
};

export const diagramRelated: string[] = ['coreBelief', 'intermediateBelief', 'copingStrategies'];

export const diagramCCD: string[] = ['situation', 'autoThought', 'emotion', 'behavior'];
