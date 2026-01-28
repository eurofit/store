'use client';
import { slugify } from '@/utils/slugify';
import { TextFieldClientProps } from 'payload';
import React, { useCallback, useEffect } from 'react';

import {
  Button,
  FieldDescription,
  FieldLabel,
  RenderCustomComponent,
  TextInput,
  useField,
  useForm,
  useFormFields,
} from '@payloadcms/ui';

import './index.scss';

type SlugProps = {
  fieldToUse: string;
  checkboxFieldPath: string;
} & TextFieldClientProps;

export const Slug: React.FC<SlugProps> = ({
  field,
  fieldToUse,
  checkboxFieldPath: checkboxFieldPathFromProps,
  path,
  readOnly: readOnlyFromProps,
}) => {
  const { label } = field;

  const checkboxFieldPath = path?.includes('.')
    ? `${path}.${checkboxFieldPathFromProps}`
    : checkboxFieldPathFromProps;

  const {
    customComponents: { AfterInput, BeforeInput, Description, Label } = {},
    value,
    setValue,
  } = useField<string>({ path: path || field.name });

  const { dispatchFields } = useForm();

  // The value of the checkbox
  // We're using separate useFormFields to minimise re-renders
  const checkboxValue = useFormFields(([fields]) => {
    return fields[checkboxFieldPath]?.value as string;
  });

  // The value of the field we're listening to for the slug
  const targetFieldValue = useFormFields(([fields]) => {
    return fields[fieldToUse]?.value as string;
  });

  useEffect(() => {
    if (!checkboxValue) return;

    const formattedSlug = targetFieldValue ? slugify(targetFieldValue) : '';
    if (value !== formattedSlug) {
      setValue(formattedSlug);
    }
  }, [targetFieldValue, checkboxValue, setValue, value]);

  const handleLock = useCallback(
    (e: React.MouseEvent<Element>) => {
      e.preventDefault();

      dispatchFields({
        type: 'UPDATE',
        path: checkboxFieldPath,
        value: !checkboxValue,
      });
    },
    [checkboxValue, checkboxFieldPath, dispatchFields],
  );

  const readOnly = readOnlyFromProps || checkboxValue;

  return (
    <div className="field-type slug-field-component">
      {BeforeInput}
      <div className="label-wrapper">
        <RenderCustomComponent
          CustomComponent={Label}
          Fallback={<FieldLabel label={label} path={path} required={field.required} />}
        />

        <Button className="lock-button" buttonStyle="none" onClick={handleLock}>
          {checkboxValue ? 'Unlock' : 'Lock'}
        </Button>
      </div>

      <TextInput
        value={value}
        onChange={setValue}
        path={path || field.name}
        readOnly={Boolean(readOnly)}
      />

      <RenderCustomComponent
        CustomComponent={Description}
        Fallback={
          <FieldDescription
            className={`field-description-${path.replace(/\./g, '__')}`}
            description={field.admin?.description ?? ''}
            path={path}
          />
        }
      />
      {AfterInput}
    </div>
  );
};
