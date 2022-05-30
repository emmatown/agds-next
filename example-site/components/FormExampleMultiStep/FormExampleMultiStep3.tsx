import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormStack } from '@ag.ds-next/form-stack';
import { Body } from '@ag.ds-next/body';
import { PageAlert } from '@ag.ds-next/page-alert';
import { useScrollToField } from '@ag.ds-next/field';
import { useEffect, useRef, useState } from 'react';
import { Checkbox, ControlGroup } from '@ag.ds-next/control-input';
import { TextInput } from '@ag.ds-next/text-input';
import { Box } from '@ag.ds-next/box';
import { mapSpacing } from '@ag.ds-next/core';
import { useFormExampleMultiStep } from './FormExampleMultiStep';
import { FormExampleMultiStepActions } from './FormExampleMultiStepActions';
import { FormExampleMultiStepContainer } from './FormExampleMultiStepContainer';

const checkboxErrorString = 'Please check at least one option';
const formSchema = yup
	.object({
		checkbox: yup
			.array()
			.typeError(checkboxErrorString)
			.of(yup.string())
			.min(1, checkboxErrorString),
		conditionalField: yup.string().when('checkbox', (value, schema) => {
			if (Array.isArray(value) && value.includes('B')) {
				return schema.required('Nested field is required');
			}
			return schema;
		}),
	})
	.required();

type FormSchema = yup.InferType<typeof formSchema>;

export const formExampleMultiStep3ValuesMap: Record<keyof FormSchema, string> =
	{
		checkbox: 'Checkbox fieldset question?',
		conditionalField: 'Nested field',
	};

export const FormExampleMultiStep3 = () => {
	const { next, stepFormState } = useFormExampleMultiStep();
	const scrollToField = useScrollToField();
	const errorRef = useRef<HTMLDivElement>(null);
	const [focusedError, setFocusedError] = useState(false);

	const {
		watch,
		register,
		handleSubmit,
		trigger,
		formState: { errors, isSubmitted },
	} = useForm<FormSchema>({
		reValidateMode: 'onChange',
		defaultValues: stepFormState,
		resolver: yupResolver(formSchema),
	});

	const onSubmit: SubmitHandler<FormSchema> = (data) => {
		setFocusedError(false);
		next(data);
	};

	const onError = () => {
		setFocusedError(false);
	};

	const hasErrors = Boolean(Object.keys(errors).length);

	useEffect(() => {
		if (hasErrors && !focusedError) {
			errorRef.current?.focus();
			setFocusedError(true);
		}
	}, [hasErrors, focusedError, errors]);

	const checkboxWatch = watch('checkbox');
	const showConditionalField =
		Array.isArray(checkboxWatch) && checkboxWatch.includes('B');

	useEffect(() => {
		if (isSubmitted) trigger();
	}, [trigger, isSubmitted, showConditionalField]);

	return (
		<FormExampleMultiStepContainer
			title="Conditional reveal title (H1)"
			introduction="The introductory paragraph provides context about this page of the form. Use a short paragraph to reduce cognitive load."
		>
			<form onSubmit={handleSubmit(onSubmit, onError)}>
				<FormStack>
					{hasErrors && (
						<PageAlert
							ref={errorRef}
							tone="error"
							title="There is a problem"
							tabIndex={-1}
						>
							<Body>
								<p>Please correct the following fields and try again</p>
								<ul>
									{Object.entries(errors).map(([key, value]) => (
										<li key={key}>
											<a href={`#${key}`} onClick={scrollToField}>
												{Array.isArray(value) ? value[0] : value.message}
											</a>
										</li>
									))}
								</ul>
							</Body>
						</PageAlert>
					)}
					<ControlGroup
						id="checkbox"
						label="Checkbox fieldset question?"
						hint="Provide a hint here"
						invalid={Boolean(errors.checkbox)}
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						message={errors?.checkbox?.message}
						required
						block
					>
						<Checkbox {...register('checkbox')} value="A">
							Checkbox label A
						</Checkbox>
						<Checkbox {...register('checkbox')} value="B">
							Checkbox label B
						</Checkbox>
						{showConditionalField ? (
							<Box
								borderLeft
								borderLeftWidth="xl"
								paddingLeft={1.5}
								css={{ marginLeft: mapSpacing(1) }}
							>
								<TextInput
									id="conditionalField"
									label="Nested field"
									hint="Hint text"
									{...register('conditionalField')}
									invalid={Boolean(errors.conditionalField?.message)}
									message={errors.conditionalField?.message}
									required
								/>
							</Box>
						) : null}
						<Checkbox {...register('checkbox')} value="C">
							Checkbox label C
						</Checkbox>
						<Checkbox {...register('checkbox')} value="D">
							Checkbox label D
						</Checkbox>
					</ControlGroup>
					<FormExampleMultiStepActions />
				</FormStack>
			</form>
		</FormExampleMultiStepContainer>
	);
};