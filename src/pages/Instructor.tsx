import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type StepInstruction = {
	text: string;
	params: Record<string, number>;
	changedParams: string[];
	prompt: string;
};

type LessonPreset = {
	id: string;
	title: string;
	simName: string;
	simPath: string;
	teachingGoal: string;
	focusParams: string[];
	defaultParams: Record<string, number>;
	presetParams: Record<string, number>;
	steps: StepInstruction[];
	assignmentIdeas: string[];
};

type LauncherItem = {
	title: string;
	path: string;
	note: string;
};

const launcherItems: LauncherItem[] = [
	{ title: 'Capacitor Lab', path: '/capacitor', note: 'Electrostatics and energy storage' },
	{ title: 'Coulomb\'s Law', path: '/columbs-law', note: 'Point-charge force behavior' },
	{ title: 'RC Circuit Lab', path: '/rc-circuit', note: 'Time constant`s and exponential behavior' },
];

const lessonPresets: LessonPreset[] = [
	{
		id: 'cap-spacing',
		title: 'Increase spacing → lower capacitance',
		simName: 'Capacitor Lab',
		simPath: '/capacitor',
		teachingGoal: 'Show that increasing plate separation d reduces C and the electric field for fixed voltage.',
		focusParams: ['plate-spacing', 'voltage', 'plate-area'],
		defaultParams: {
			'plate-area': 180,
			'plate-spacing': 5,
			'dielectric-constant': 1,
			voltage: 24,
		},
		presetParams: {
			'plate-area': 180,
			'plate-spacing': 10,
			'dielectric-constant': 1,
			voltage: 24,
		},
		steps: [
			{
				text: 'Set spacing to 5 mm and establish the baseline.',
				params: { 'plate-area': 180, 'plate-spacing': 5, 'dielectric-constant': 1, voltage: 24 },
				changedParams: ['plate-spacing'],
				prompt: 'What happens to capacitance if spacing doubles?',
			},
			{
				text: 'Increase spacing to 10 mm while keeping voltage fixed.',
				params: { 'plate-area': 180, 'plate-spacing': 10, 'dielectric-constant': 1, voltage: 24 },
				changedParams: ['plate-spacing'],
				prompt: 'How should electric field and C respond?',
			},
			{
				text: 'Raise spacing further to 12 mm to reinforce trend.',
				params: { 'plate-area': 180, 'plate-spacing': 12, 'dielectric-constant': 1, voltage: 24 },
				changedParams: ['plate-spacing'],
				prompt: 'Is the relationship linear or inverse?',
			},
			{
				text: 'Return to 5 mm to verify reversibility.',
				params: { 'plate-area': 180, 'plate-spacing': 5, 'dielectric-constant': 1, voltage: 24 },
				changedParams: ['plate-spacing'],
				prompt: 'Does the original value restore the baseline?',
			},
		],
		assignmentIdeas: [
			'Explain what happens to C when spacing doubles and justify using the equation.',
			'Predict the energy change if voltage is held constant and d increases.',
		],
	},
	{
		id: 'cap-dielectric',
		title: 'Add dielectric → higher capacitance',
		simName: 'Capacitor Lab',
		simPath: '/capacitor',
		teachingGoal: 'Show that larger dielectric constant k increases capacitance and charge storage at fixed voltage.',
		focusParams: ['dielectric-constant', 'voltage', 'plate-area'],
		defaultParams: {
			'plate-area': 180,
			'plate-spacing': 5,
			'dielectric-constant': 1,
			voltage: 24,
		},
		presetParams: {
			'plate-area': 180,
			'plate-spacing': 5,
			'dielectric-constant': 6,
			voltage: 24,
		},
		steps: [
			{
				text: 'Start with k = 1 and read baseline C.',
				params: { 'plate-area': 180, 'plate-spacing': 5, 'dielectric-constant': 1, voltage: 24 },
				changedParams: ['dielectric-constant'],
				prompt: 'What does dielectric physically do?',
			},
			{
				text: 'Raise dielectric constant to k = 3.',
				params: { 'plate-area': 180, 'plate-spacing': 5, 'dielectric-constant': 3, voltage: 24 },
				changedParams: ['dielectric-constant'],
				prompt: 'How much should C increase relative to k?',
			},
			{
				text: 'Increase dielectric constant to k = 6.',
				params: { 'plate-area': 180, 'plate-spacing': 5, 'dielectric-constant': 6, voltage: 24 },
				changedParams: ['dielectric-constant'],
				prompt: 'How do charge dots compare to step 1?',
			},
			{
				text: 'Drop back to k = 1 for contrast.',
				params: { 'plate-area': 180, 'plate-spacing': 5, 'dielectric-constant': 1, voltage: 24 },
				changedParams: ['dielectric-constant'],
				prompt: 'Why is this effect reversible?',
			},
		],
		assignmentIdeas: [
			'Compare charge storage for k = 1 vs k = 6 at fixed V.',
			'Describe one real-world device where dielectric choice matters.',
		],
	},
	{
		id: 'cap-area',
		title: 'Increase plate area → higher capacitance',
		simName: 'Capacitor Lab',
		simPath: '/capacitor',
		teachingGoal: 'Connect geometric area A to larger charge capacity and energy storage.',
		focusParams: ['plate-area', 'voltage'],
		defaultParams: {
			'plate-area': 120,
			'plate-spacing': 5,
			'dielectric-constant': 2,
			voltage: 20,
		},
		presetParams: {
			'plate-area': 360,
			'plate-spacing': 5,
			'dielectric-constant': 2,
			voltage: 20,
		},
		steps: [
			{
				text: 'Start at area A = 120 cm^2.',
				params: { 'plate-area': 120, 'plate-spacing': 5, 'dielectric-constant': 2, voltage: 20 },
				changedParams: ['plate-area'],
				prompt: 'Predict what tripling area will do to C.',
			},
			{
				text: 'Increase area to A = 240 cm^2.',
				params: { 'plate-area': 240, 'plate-spacing': 5, 'dielectric-constant': 2, voltage: 20 },
				changedParams: ['plate-area'],
				prompt: 'Do charge and energy also rise?',
			},
			{
				text: 'Increase area to A = 360 cm^2.',
				params: { 'plate-area': 360, 'plate-spacing': 5, 'dielectric-constant': 2, voltage: 20 },
				changedParams: ['plate-area'],
				prompt: 'Is the scaling close to proportional?',
			},
			{
				text: 'Reset to A = 120 cm^2 to close the loop.',
				params: { 'plate-area': 120, 'plate-spacing': 5, 'dielectric-constant': 2, voltage: 20 },
				changedParams: ['plate-area'],
				prompt: 'What stayed constant through all steps?',
			},
		],
		assignmentIdeas: [
			'Estimate the ratio C_large/C_small from the area ratio.',
			'Explain why area changes charge capacity even when d is fixed.',
		],
	},
	{
		id: 'coulomb-attract',
		title: 'Opposite charges → attraction',
		simName: 'Coulomb\'s Law',
		simPath: '/columbs-law',
		teachingGoal: 'Compare attraction behavior and force magnitude for unlike charges.',
		focusParams: ['charge-q1', 'charge-q2', 'separation-r'],
		defaultParams: {
			'charge-q1': 3,
			'charge-q2': -3,
			'separation-r': 1.2,
		},
		presetParams: {
			'charge-q1': 4,
			'charge-q2': -6,
			'separation-r': 1.1,
		},
		steps: [
			{
				text: 'Set q1 = +4 uC and q2 = -6 uC at r = 1.1 m.',
				params: { 'charge-q1': 4, 'charge-q2': -6, 'separation-r': 1.1 },
				changedParams: ['charge-q1', 'charge-q2'],
				prompt: 'What direction should each force arrow point?',
			},
			{
				text: 'Decrease separation to r = 0.8 m.',
				params: { 'charge-q1': 4, 'charge-q2': -6, 'separation-r': 0.8 },
				changedParams: ['separation-r'],
				prompt: 'How quickly does force magnitude grow?',
			},
			{
				text: 'Increase separation to r = 1.6 m.',
				params: { 'charge-q1': 4, 'charge-q2': -6, 'separation-r': 1.6 },
				changedParams: ['separation-r'],
				prompt: 'Compare this value with the previous step.',
			},
			{
				text: 'Return to r = 1.1 m for summary.',
				params: { 'charge-q1': 4, 'charge-q2': -6, 'separation-r': 1.1 },
				changedParams: ['separation-r'],
				prompt: 'Why are signs important but distance still dominant?',
			},
		],
		assignmentIdeas: [
			'Explain why opposite charges attract using the sign of q1*q2.',
			'Estimate force change if separation is reduced by 20%.',
		],
	},
	{
		id: 'coulomb-repel',
		title: 'Like charges → repulsion',
		simName: 'Coulomb\'s Law',
		simPath: '/columbs-law',
		teachingGoal: 'Demonstrate repulsion with same-sign charges and compare with attraction case.',
		focusParams: ['charge-q1', 'charge-q2', 'separation-r'],
		defaultParams: {
			'charge-q1': 3,
			'charge-q2': 3,
			'separation-r': 1.2,
		},
		presetParams: {
			'charge-q1': 6,
			'charge-q2': 5,
			'separation-r': 1.2,
		},
		steps: [
			{
				text: 'Set q1 = +6 uC, q2 = +5 uC at r = 1.2 m.',
				params: { 'charge-q1': 6, 'charge-q2': 5, 'separation-r': 1.2 },
				changedParams: ['charge-q1', 'charge-q2'],
				prompt: 'What differs from the attraction case?',
			},
			{
				text: 'Increase q1 to +8 uC.',
				params: { 'charge-q1': 8, 'charge-q2': 5, 'separation-r': 1.2 },
				changedParams: ['charge-q1'],
				prompt: 'Should force scale proportionally with q1?',
			},
			{
				text: 'Increase q2 to +8 uC.',
				params: { 'charge-q1': 8, 'charge-q2': 8, 'separation-r': 1.2 },
				changedParams: ['charge-q2'],
				prompt: 'How does matching charge strength affect force?',
			},
			{
				text: 'Restore q1 = +6 uC and q2 = +5 uC.',
				params: { 'charge-q1': 6, 'charge-q2': 5, 'separation-r': 1.2 },
				changedParams: ['charge-q1', 'charge-q2'],
				prompt: 'Why are magnitudes symmetric across charges?',
			},
		],
		assignmentIdeas: [
			'Contrast attraction and repulsion using one sentence and one equation.',
			'Predict force if one charge is halved while distance is fixed.',
		],
	},
	{
		id: 'coulomb-distance-law',
		title: 'Distance doubling → force quartering',
		simName: 'Coulomb\'s Law',
		simPath: '/columbs-law',
		teachingGoal: 'Illustrate the inverse-square dependency F proportional to 1/r^2.',
		focusParams: ['separation-r'],
		defaultParams: {
			'charge-q1': 4,
			'charge-q2': -4,
			'separation-r': 1,
		},
		presetParams: {
			'charge-q1': 4,
			'charge-q2': -4,
			'separation-r': 2,
		},
		steps: [
			{
				text: 'Start at r = 1.0 m and note force.',
				params: { 'charge-q1': 4, 'charge-q2': -4, 'separation-r': 1 },
				changedParams: ['separation-r'],
				prompt: 'Use this as F0 baseline.',
			},
			{
				text: 'Increase to r = 2.0 m.',
				params: { 'charge-q1': 4, 'charge-q2': -4, 'separation-r': 2 },
				changedParams: ['separation-r'],
				prompt: 'Should force be near F0/4?',
			},
			{
				text: 'Increase to r = 3.0 m.',
				params: { 'charge-q1': 4, 'charge-q2': -4, 'separation-r': 3 },
				changedParams: ['separation-r'],
				prompt: 'Estimate expected ratio before reading.',
			},
			{
				text: 'Return to r = 1.0 m for wrap-up.',
				params: { 'charge-q1': 4, 'charge-q2': -4, 'separation-r': 1 },
				changedParams: ['separation-r'],
				prompt: 'Why does small distance change dominate so strongly?',
			},
		],
		assignmentIdeas: [
			'Use inverse-square law to compute expected force ratio at r = 3r0.',
			'Explain why distance dominates force sensitivity.',
		],
	},
	{
		id: 'rc-fast-charge',
		title: 'Smaller RC → faster charging',
		simName: 'RC Circuit Lab',
		simPath: '/rc-circuit',
		teachingGoal: 'Show that a smaller time constant tau = RC gives faster capacitor voltage rise.',
		focusParams: ['resistance-r', 'capacitance-c', 'source-voltage'],
		defaultParams: {
			'resistance-r': 6800,
			'capacitance-c': 900,
			'source-voltage': 6,
			'initial-capacitor-charge': 0,
		},
		presetParams: {
			'resistance-r': 1000,
			'capacitance-c': 220,
			'source-voltage': 6,
			'initial-capacitor-charge': 0,
		},
		steps: [
			{
				text: 'Set R = 1k and C = 220 uF.',
				params: { 'resistance-r': 1000, 'capacitance-c': 220, 'source-voltage': 6, 'initial-capacitor-charge': 0 },
				changedParams: ['resistance-r', 'capacitance-c'],
				prompt: 'Predict the charging speed from tau = RC.',
			},
			{
				text: 'Raise source voltage to 9 V.',
				params: { 'resistance-r': 1000, 'capacitance-c': 220, 'source-voltage': 9, 'initial-capacitor-charge': 0 },
				changedParams: ['source-voltage'],
				prompt: 'Does tau change when source voltage changes?',
			},
			{
				text: 'Return source voltage to 6 V.',
				params: { 'resistance-r': 1000, 'capacitance-c': 220, 'source-voltage': 6, 'initial-capacitor-charge': 0 },
				changedParams: ['source-voltage'],
				prompt: 'What changed: speed, final value, or both?',
			},
			{
				text: 'Increase C to 470 uF for direct contrast.',
				params: { 'resistance-r': 1000, 'capacitance-c': 470, 'source-voltage': 6, 'initial-capacitor-charge': 0 },
				changedParams: ['capacitance-c'],
				prompt: 'How does larger C alter the transient?',
			},
		],
		assignmentIdeas: [
			'Compute tau for both settings and compare with the scope curves.',
			'Explain why fast charging can be useful in switching circuits.',
		],
	},
	{
		id: 'rc-slow-charge',
		title: 'Larger RC → slower response',
		simName: 'RC Circuit Lab',
		simPath: '/rc-circuit',
		teachingGoal: 'Demonstrate how larger resistance and capacitance slow transient response.',
		focusParams: ['resistance-r', 'capacitance-c'],
		defaultParams: {
			'resistance-r': 1500,
			'capacitance-c': 220,
			'source-voltage': 6,
			'initial-capacitor-charge': 0,
		},
		presetParams: {
			'resistance-r': 12000,
			'capacitance-c': 1200,
			'source-voltage': 6,
			'initial-capacitor-charge': 0,
		},
		steps: [
			{
				text: 'Set R = 12k and C = 1200 uF.',
				params: { 'resistance-r': 12000, 'capacitance-c': 1200, 'source-voltage': 6, 'initial-capacitor-charge': 0 },
				changedParams: ['resistance-r', 'capacitance-c'],
				prompt: 'How large is tau now compared with a fast case?',
			},
			{
				text: 'Drop R to 6k while keeping C fixed.',
				params: { 'resistance-r': 6000, 'capacitance-c': 1200, 'source-voltage': 6, 'initial-capacitor-charge': 0 },
				changedParams: ['resistance-r'],
				prompt: 'Which way does current peak move?',
			},
			{
				text: 'Restore R to 12k and halve C to 600 uF.',
				params: { 'resistance-r': 12000, 'capacitance-c': 600, 'source-voltage': 6, 'initial-capacitor-charge': 0 },
				changedParams: ['capacitance-c'],
				prompt: 'Can different R/C pairs create similar tau?',
			},
			{
				text: 'Return to R = 12k, C = 1200 uF.',
				params: { 'resistance-r': 12000, 'capacitance-c': 1200, 'source-voltage': 6, 'initial-capacitor-charge': 0 },
				changedParams: ['resistance-r', 'capacitance-c'],
				prompt: 'Summarize how R and C jointly shape dynamics.',
			},
		],
		assignmentIdeas: [
			'Estimate settling time using approximately 5*tau.',
			'Describe a situation where slow response is desirable.',
		],
	},
	{
		id: 'rc-initial-charge',
		title: 'Initial charge changes transient',
		simName: 'RC Circuit Lab',
		simPath: '/rc-circuit',
		teachingGoal: 'Show how nonzero initial capacitor charge changes early-time behavior.',
		focusParams: ['initial-capacitor-charge', 'source-voltage'],
		defaultParams: {
			'resistance-r': 4700,
			'capacitance-c': 680,
			'source-voltage': 6,
			'initial-capacitor-charge': 0,
		},
		presetParams: {
			'resistance-r': 4700,
			'capacitance-c': 680,
			'source-voltage': 6,
			'initial-capacitor-charge': 2200,
		},
		steps: [
			{
				text: 'Start with zero initial capacitor charge.',
				params: { 'resistance-r': 4700, 'capacitance-c': 680, 'source-voltage': 6, 'initial-capacitor-charge': 0 },
				changedParams: ['initial-capacitor-charge'],
				prompt: 'What is the initial capacitor voltage?',
			},
			{
				text: 'Set initial charge to 2200 uC.',
				params: { 'resistance-r': 4700, 'capacitance-c': 680, 'source-voltage': 6, 'initial-capacitor-charge': 2200 },
				changedParams: ['initial-capacitor-charge'],
				prompt: 'How does the curve start differently?',
			},
			{
				text: 'Increase initial charge to 3200 uC.',
				params: { 'resistance-r': 4700, 'capacitance-c': 680, 'source-voltage': 6, 'initial-capacitor-charge': 3200 },
				changedParams: ['initial-capacitor-charge'],
				prompt: 'Does tau change or only initial condition?',
			},
			{
				text: 'Return initial charge to zero for comparison.',
				params: { 'resistance-r': 4700, 'capacitance-c': 680, 'source-voltage': 6, 'initial-capacitor-charge': 0 },
				changedParams: ['initial-capacitor-charge'],
				prompt: 'Why can same circuit show different trajectories?',
			},
		],
		assignmentIdeas: [
			'Explain the role of initial conditions in first-order systems.',
			'Predict curve change if initial charge is above final steady-state.',
		],
	},
];

function paramsToSearch(params: Record<string, number>): string {
	const query = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		query.set(key, String(value));
	});
	return query.toString();
}

function withBase(path: string): string {
	const base = import.meta.env.BASE_URL;
	const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${cleanBase}${path}`;
}

export function Instructor() {
	const [guidedMode, setGuidedMode] = useState(false);
	const [selectedSimPath, setSelectedSimPath] = useState(launcherItems[0]?.path ?? '/capacitor');
	const [activeLessonId, setActiveLessonId] = useState('');
	const [activeStepIndex, setActiveStepIndex] = useState(0);
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [highlightedParams, setHighlightedParams] = useState<string[]>([]);
	const [isPlayingDemo, setIsPlayingDemo] = useState(false);
	const [isApplyingStep, setIsApplyingStep] = useState(false);
	const [stepFlashTick, setStepFlashTick] = useState(0);
	const [guidedPreviewUrl, setGuidedPreviewUrl] = useState<string | null>(null);
	const playTimerRef = useRef<number | null>(null);
	const applyStepTimerRef = useRef<number | null>(null);

	const visibleLessons = useMemo(
		() => lessonPresets.filter((lesson) => lesson.simPath === selectedSimPath),
		[selectedSimPath]
	);

	useEffect(() => {
		if (visibleLessons.length === 0) {
			stopPlayDemo();
			setActiveLessonId('');
			setActiveStepIndex(0);
			return;
		}

		const hasExistingActive = visibleLessons.some((lesson) => lesson.id === activeLessonId);
		if (!hasExistingActive) {
			stopPlayDemo();
			setActiveLessonId(visibleLessons[0].id);
			setActiveStepIndex(0);
		}
	}, [activeLessonId, visibleLessons]);

	useEffect(() => {
		if (!guidedMode) {
			stopPlayDemo();
		}
	}, [guidedMode]);

	useEffect(() => {
		if (!activeLesson) return;

		setGuidedPreviewUrl(buildRelativeUrl(activeLesson.simPath, activeLesson.presetParams, true));
	}, [activeLessonId, selectedSimPath]);

	const activeLesson = useMemo(
		() => visibleLessons.find((lesson) => lesson.id === activeLessonId) ?? visibleLessons[0],
		[activeLessonId, visibleLessons]
	);

	useEffect(() => {
		return () => {
			if (playTimerRef.current !== null) {
				window.clearTimeout(playTimerRef.current);
			}
			if (applyStepTimerRef.current !== null) {
				window.clearTimeout(applyStepTimerRef.current);
			}
		};
	}, []);

	const buildRelativeUrl = (simPath: string, params: Record<string, number>, clean = false) => {
		const search = paramsToSearch(params);
		const basePath = withBase(simPath);
		const query = new URLSearchParams(search);
		if (clean) {
			query.set('clean', '1');
		}
		return `${basePath}?${query.toString()}`;
	};

	const buildAbsoluteUrl = (simPath: string, params: Record<string, number>, clean = false) => {
		const relative = buildRelativeUrl(simPath, params, clean);
		if (typeof window === 'undefined') return relative;
		return `${window.location.origin}${relative}`;
	};

	const copyPresetUrl = async (lesson: LessonPreset) => {
		const url = buildAbsoluteUrl(lesson.simPath, lesson.presetParams);
		try {
			await navigator.clipboard.writeText(url);
			setCopiedId(lesson.id);
			window.setTimeout(() => setCopiedId(null), 1200);
		} catch {
			setCopiedId(null);
		}
	};

	const runStep = (lesson: LessonPreset, stepIndex: number, clean = false) => {
		const step = lesson.steps[stepIndex];
		if (!step) return;

		const query = new URLSearchParams(paramsToSearch(step.params));
		if (clean) {
			query.set('clean', '1');
		}
		query.set('__demoStep', String(stepIndex + 1));
		query.set('__demoTs', String(Date.now()));
		if (step.changedParams.length > 0) {
			query.set('__demoChanged', step.changedParams.join(','));
		}
		const stepUrl = `${withBase(lesson.simPath)}?${query.toString()}`;
		setGuidedPreviewUrl(stepUrl);
		setIsApplyingStep(true);
		setStepFlashTick((prev) => prev + 1);
		if (applyStepTimerRef.current !== null) {
			window.clearTimeout(applyStepTimerRef.current);
		}
		applyStepTimerRef.current = window.setTimeout(() => {
			setIsApplyingStep(false);
			applyStepTimerRef.current = null;
		}, 700);
		setHighlightedParams(step.changedParams);
		window.setTimeout(() => setHighlightedParams([]), 900);
	};

	const stopPlayDemo = () => {
		setIsPlayingDemo(false);
		if (playTimerRef.current !== null) {
			window.clearTimeout(playTimerRef.current);
			playTimerRef.current = null;
		}
	};

	const goToStep = (nextStep: number) => {
		if (!activeLesson) return;
		const clamped = Math.max(0, Math.min(activeLesson.steps.length - 1, nextStep));
		setActiveStepIndex(clamped);
		if (guidedMode) {
			runStep(activeLesson, clamped);
		}
	};

	const playDemo = () => {
		if (!activeLesson) return;
		if (isPlayingDemo) {
			stopPlayDemo();
			return;
		}

		setIsPlayingDemo(true);
		const start = Math.max(0, activeStepIndex);

		const schedule = (index: number) => {
			setActiveStepIndex(index);
			runStep(activeLesson, index);

			if (index >= activeLesson.steps.length - 1) {
				setIsPlayingDemo(false);
				playTimerRef.current = null;
				return;
			}

			playTimerRef.current = window.setTimeout(() => {
				schedule(index + 1);
			}, 1900);
		};

		schedule(start);
	};

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (!guidedMode) return;
			if (!activeLesson) return;
			if (event.altKey || event.ctrlKey || event.metaKey) return;
			const target = event.target as HTMLElement | null;
			const tagName = target?.tagName.toLowerCase();
			if (tagName === 'input' || tagName === 'textarea') return;

			if (event.key === 'ArrowRight') {
				event.preventDefault();
				goToStep(activeStepIndex + 1);
				return;
			}

			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				goToStep(activeStepIndex - 1);
				return;
			}

			if (event.key.toLowerCase() === 'f') {
				event.preventDefault();
				runStep(activeLesson, activeStepIndex, true);
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [activeLesson, activeStepIndex, guidedMode]);

	const resetPreset = (lesson: LessonPreset) => {
		const url = buildRelativeUrl(lesson.simPath, lesson.defaultParams);
		window.open(url, '_self');
	};

	const currentStep = activeLesson?.steps[activeStepIndex];
	const progressPercent = activeLesson
		? ((activeStepIndex + 1) / Math.max(activeLesson.steps.length, 1)) * 100
		: 0;

	const previewEntries = (params: Record<string, number>) => Object.entries(params).slice(0, 4);

	const paramUnit = (key: string) => {
		if (key.includes('spacing')) return 'mm';
		if (key.includes('area')) return 'cm^2';
		if (key.includes('voltage')) return 'V';
		if (key.includes('charge')) return 'uC';
		if (key.includes('capacitance')) return 'uF';
		if (key.includes('resistance')) return 'ohm';
		if (key.includes('dielectric')) return '';
		if (key.includes('separation')) return 'm';
		return '';
	};

	const prettyKey = (key: string) =>
		key
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');

	return (
		<div className="mx-auto min-h-screen max-w-7xl px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
			<header className="mb-6 rounded-3xl border border-cyan-400/25 bg-[linear-gradient(145deg,rgba(8,47,73,0.45),rgba(2,6,23,0.94))] p-6 shadow-[0_22px_70px_rgba(2,6,23,0.55)]">
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Instructor Console</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
					Lesson Presets and Live Demo Tools
				</h1>
				<p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
					Use shareable preset links, guided scripts, and clean fullscreen launches for lecture projection.
					Every preset uses URL state so students can open exactly the same simulation state.
				</p>
				<div className="mt-5 flex flex-wrap items-center gap-3">
					<button
						type="button"
						onClick={() => setGuidedMode((prev) => !prev)}
						className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${guidedMode ? 'border-emerald-300/70 bg-emerald-400/15 text-emerald-100 shadow-[0_0_0_2px_rgba(16,185,129,0.22)]' : 'border-white/15 bg-white/[0.03] text-slate-200 hover:border-cyan-300/50'}`}
					>
						{guidedMode ? 'Guided Mode Active' : 'Enable Guided Mode'}
					</button>
					<Link
						to="/"
						className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:border-cyan-300/60 hover:text-cyan-100"
					>
						Back to Home
					</Link>
				</div>
			</header>

			<section className="mb-6 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
				<h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Quick simulation launcher</h2>
				<p className="mt-2 text-sm text-slate-300">Select a lab here to show its instructor guides. Use Open or Fullscreen buttons from the guide cards below.</p>
				<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{launcherItems.map((item) => (
						<button
							type="button"
							key={item.path}
							onClick={() => setSelectedSimPath(item.path)}
							className={`w-full rounded-2xl border p-4 text-left transition ${selectedSimPath === item.path ? 'border-cyan-300/65 bg-cyan-400/12 ring-1 ring-cyan-300/35' : 'border-white/10 bg-white/[0.03] hover:border-cyan-300/40'}`}
						>
							<p className="text-sm font-semibold text-slate-100">{item.title}</p>
							<p className="mt-1 text-xs text-slate-400">{item.note}</p>
							<p className="mt-3 text-[0.68rem] uppercase tracking-[0.12em] text-cyan-200">
								{selectedSimPath === item.path ? 'Selected for guide panel' : 'Click to view guide presets'}
							</p>
						</button>
					))}
				</div>
			</section>

			<main className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
				<section className="space-y-4">
					{visibleLessons.map((lesson) => {
						const presetHref = buildRelativeUrl(lesson.simPath, lesson.presetParams);
						const fullscreenHref = buildRelativeUrl(lesson.simPath, lesson.presetParams, true);

						return (
							<article key={lesson.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-lg shadow-slate-950/30">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<p className="text-[0.68rem] uppercase tracking-[0.18em] text-cyan-300">{lesson.simName}</p>
										<h3 className="mt-1 text-xl font-semibold text-slate-50">{lesson.title}</h3>
										<p className="mt-2 text-sm text-slate-300">{lesson.teachingGoal}</p>
									</div>
									<button
										type="button"
										onClick={() => {
											setActiveLessonId(lesson.id);
											setActiveStepIndex(0);
										}}
										className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${activeLesson?.id === lesson.id ? 'border-emerald-300/60 bg-emerald-400/10 text-emerald-100' : 'border-white/15 text-slate-200 hover:border-cyan-300/50'}`}
									>
										Select script
									</button>
								</div>

								<div className="mt-4 flex flex-wrap gap-2">
									{lesson.focusParams.map((param) => {
										const isFocusedLesson = activeLesson?.id === lesson.id;
										const isHighlighted = guidedMode && isFocusedLesson;
										const isChangedNow = isFocusedLesson && highlightedParams.includes(param);
										return (
											<span
												key={param}
												className={`rounded-full border px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.12em] ${isChangedNow ? 'border-fuchsia-300/80 bg-fuchsia-300/18 text-fuchsia-100 shadow-[0_0_14px_rgba(232,121,249,0.35)]' : isHighlighted ? 'border-amber-300/70 bg-amber-300/15 text-amber-100' : 'border-white/10 bg-white/[0.03] text-slate-300'}`}
											>
												Focus: {param}
											</span>
										);
									})}
								</div>

								<div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
									<p className="text-[0.68rem] uppercase tracking-[0.16em] text-slate-400">Preset preview values</p>
									<div className="mt-2 flex flex-wrap gap-2">
										{previewEntries(lesson.presetParams).map(([key, value]) => {
											const unit = paramUnit(key);
											return (
												<span key={`${lesson.id}-${key}`} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-200">
													{prettyKey(key)} = {value}{unit ? ` ${unit}` : ''}
												</span>
											);
										})}
									</div>
								</div>

								<div className="mt-4 flex flex-wrap gap-2">
									<a
										href={presetHref}
										className="rounded-full border border-cyan-300/50 bg-cyan-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-300/20"
									>
										Open preset
									</a>
									<button
										type="button"
										onClick={() => copyPresetUrl(lesson)}
										className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:border-cyan-300/50"
									>
										{copiedId === lesson.id ? 'Copied' : 'Copy link'}
									</button>
									<a
										href={fullscreenHref}
										target="_blank"
										rel="noreferrer"
										className="rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-100 transition hover:bg-emerald-300/20"
									>
										Open in fullscreen
									</a>
									<button
										type="button"
										onClick={() => copyPresetUrl({ ...lesson, presetParams: lesson.steps[activeStepIndex]?.params ?? lesson.presetParams })}
										className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-300/20"
									>
										Student view link
									</button>
									<button
										type="button"
										onClick={() => resetPreset(lesson)}
										className="rounded-full border border-rose-300/40 bg-rose-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-rose-100 transition hover:bg-rose-300/20"
									>
										Reset to default
									</button>
								</div>

								<div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
									<p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-400">Demo script</p>
									<ol className="mt-2 space-y-1.5 text-sm text-slate-200">
										{lesson.steps.map((step, index) => {
											const isActive = guidedMode && activeLesson?.id === lesson.id && activeStepIndex === index;
											return (
												<li key={`${lesson.id}-step-${index}`} className={`rounded-lg px-2 py-1 ${isActive ? 'bg-amber-300/20 text-amber-100 ring-2 ring-amber-300/60 shadow-[0_0_14px_rgba(251,191,36,0.25)]' : ''}`}>
													{index + 1}. {step.text}
													<p className="mt-1 text-xs text-slate-400">Prompt: {step.prompt}</p>
												</li>
											);
										})}
									</ol>
								</div>

								<div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
									<p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-400">Example assignment ideas</p>
									<ul className="mt-2 space-y-1 text-sm text-slate-300">
										{lesson.assignmentIdeas.map((idea) => (
											<li key={idea}>- {idea}</li>
										))}
									</ul>
								</div>
							</article>
						);
					})}
					{visibleLessons.length === 0 ? (
						<div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
							No presets are configured for this lab yet.
						</div>
					) : null}
				</section>

				<aside className="space-y-4">
					<section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
						<h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">Guided mode</h2>
						<p className="mt-2 text-sm text-slate-300">
							Walk through one lesson script step-by-step during class. Next/Prev auto-apply step values to the embedded live preview.
						</p>
						{activeLesson ? (
							<div className="mt-4 space-y-3">
								<div className="rounded-2xl border border-cyan-300/20 bg-slate-900/80 p-3">
									<div className="mb-2 flex items-center justify-between gap-3">
										<div>
											<p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-400">Live preview</p>
											<p className="text-xs text-slate-400">This stays on the same page and updates as you step through the lesson.</p>
										</div>
										<span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-cyan-100">
											Clean mode
										</span>
									</div>
									{(guidedPreviewUrl || activeLesson) ? (
										<iframe
											title={`${activeLesson.title} guided preview`}
											src={guidedPreviewUrl ?? buildRelativeUrl(activeLesson.simPath, activeLesson.presetParams, true)}
											className="h-72 w-full rounded-xl border border-white/10 bg-slate-950"
											sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
											loading="lazy"
										/>
									) : null}
								</div>
								
								<p className="text-xs uppercase tracking-[0.16em] text-slate-400">Active lesson</p>
								<p className="text-sm font-semibold text-slate-100">{activeLesson.title}</p>
								<div className="h-2 overflow-hidden rounded-full bg-slate-800">
									<div className={`h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all ${isApplyingStep ? 'animate-pulse' : ''}`} style={{ width: `${progressPercent}%` }} />
								</div>
								<p className="text-xs text-slate-400">Step {activeStepIndex + 1} / {activeLesson.steps.length}</p>
								<div className={`rounded-xl border border-amber-300/35 bg-amber-300/10 p-3 text-sm text-amber-100 transition-all ${isApplyingStep ? 'ring-2 ring-cyan-300/60 shadow-[0_0_18px_rgba(34,211,238,0.35)]' : ''}`}>
									Step {activeStepIndex + 1} of {activeLesson.steps.length}: {currentStep?.text}
									<p className="mt-2 text-xs text-amber-100/90">Ask question: {currentStep?.prompt}</p>
								</div>
								{isApplyingStep ? (
									<div className="rounded-lg border border-cyan-300/50 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 animate-pulse">
										Applying step {activeStepIndex + 1} to demo window...
									</div>
								) : null}
								<div key={stepFlashTick} className={`h-1 overflow-hidden rounded-full bg-slate-800 ${isApplyingStep ? '' : 'opacity-0'}`}>
									<div className="h-full w-full origin-left animate-[ping_700ms_ease-out_1] bg-cyan-300/80" />
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										disabled={activeStepIndex === 0}
										onClick={() => goToStep(activeStepIndex - 1)}
										className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 disabled:opacity-40"
									>
										Prev
									</button>
									<button
										type="button"
										disabled={activeStepIndex >= activeLesson.steps.length - 1}
										onClick={() => goToStep(activeStepIndex + 1)}
										className="rounded-full border border-cyan-300/50 bg-cyan-300/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 disabled:opacity-40"
									>
										Next
									</button>
									<button
										type="button"
										onClick={playDemo}
										className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] ${isPlayingDemo ? 'border-rose-300/60 bg-rose-400/15 text-rose-100' : 'border-emerald-300/60 bg-emerald-400/15 text-emerald-100'}`}
									>
										{isPlayingDemo ? 'Stop demo' : 'Play demo'}
									</button>
									<button
										type="button"
										onClick={() => runStep(activeLesson, activeStepIndex, true)}
										className="rounded-full border border-emerald-300/50 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-100"
									>
										Fullscreen current
									</button>
								</div>
								<p className="text-xs text-slate-400">Shortcuts: Right arrow = next, Left arrow = prev, F = fullscreen current step.</p>
							</div>
						) : null}
					</section>

					<section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
						<h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Slide and projection tips</h2>
						<ul className="mt-3 space-y-2 text-sm text-slate-300">
							<li>- Use Open in fullscreen for clean lecture projection.</li>
							<li>- Copy link directly into slides, Canvas, or email.</li>
							<li>- Take a screenshot after setting a key state for static notes.</li>
						</ul>
					</section>
				</aside>
			</main>
		</div>
	);
}
