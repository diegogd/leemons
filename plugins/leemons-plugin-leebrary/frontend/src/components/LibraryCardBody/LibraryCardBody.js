/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { Box, Badge, Text, TextClamp } from '@bubbles-ui/components';
import { isArray } from 'lodash';
import { SubjectItemDisplay } from '@academic-portfolio/components';
import {
  LIBRARY_CARD_BODY_PROP_TYPES,
  LIBRARY_CARD_BODY_DEFAULT_PROPS,
} from './LibraryCardBody.constants';
import { LibraryCardBodyStyles } from './LibraryCardBody.styles';
import { FavButton } from '../FavButton';
import { pinAssetRequest, unpinAssetRequest } from '../../request';

const LibraryCardBody = ({
  description,
  variant,
  fullHeight,
  published,
  subjects,
  providerData,
  program,
  pinned,
  id,
  ...props
}) => {
  const { classes } = LibraryCardBodyStyles({ fullHeight }, { name: 'LibraryCardBody' });
  const [isFav, setIsFav] = useState(pinned);
  const [subjectData, setSubjectData] = useState(null);

  const isDraft = typeof providerData?.published === 'boolean' && providerData?.published === false;
  const title = props.name ? props.name : null;

  const handleIsFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      unpinAssetRequest(id);
      setIsFav(false);
    } else {
      pinAssetRequest(id);
      setIsFav(true);
    }
  };

  useEffect(() => {
    const subjectIds = isArray(subjects) && subjects.map((s) => s.subject);
    setSubjectData(subjectIds);
  }, [subjects]);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box onClick={handleIsFav}>
          <FavButton isActive={isFav} />
        </Box>
        {isDraft && (
          <Badge closable={false} size="xs" className={classes.draftBadge}>
            <Text className={classes.draftText}>{'BORRADOR'}</Text>
          </Badge>
        )}
      </Box>
      <Box className={classes.titleContainer}>
        {title && (
          <TextClamp lines={2}>
            <Text className={classes.title}>{title}</Text>
          </TextClamp>
        )}
      </Box>
      <Box>
        {description && (
          <TextClamp lines={2}>
            <Text size="xs" className={classes.description}>
              {description}
            </Text>
          </TextClamp>
        )}
      </Box>
      <Box className={classes.subjectsContainer}>
        <Box className={classes.subject}>
          <SubjectItemDisplay subjectsIds={subjectData} programId={program} />
        </Box>
      </Box>
    </Box>
  );
};
LibraryCardBody.defaultProps = LIBRARY_CARD_BODY_DEFAULT_PROPS;
LibraryCardBody.propTypes = LIBRARY_CARD_BODY_PROP_TYPES;
export { LibraryCardBody };
