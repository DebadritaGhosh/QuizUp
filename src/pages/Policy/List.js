import React from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  makeStyles,
  Typography,
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router';

// containers
import PolicyContainers from 'containers/Policy';

// components
import Page from 'components/Page';

// hooks
import useForm from 'hooks/useForm';
import usePagination from 'hooks/usePagination';

// utils
import { queryStringMaker } from 'utils';

const List = () => {
  const classes = useStyles();
  const history = useHistory();
  const filter = useForm({
    orderBy: 'createdAt',
    sort: 'desc',
    searchType: 'createdDate',
    createdAtStart: '',
    createdAtEnd: '',
    classification: ['termsConditions', 'privacyPolicy'],
  });
  const pagination = usePagination(() => {
    const filterObject = {
      limit: pagination.limit,
      skip: pagination.skip,
      orderBy: filter.form.orderBy,
      sort: filter.form.sort,
    };

    const queryString = queryStringMaker(filterObject);

    pagination.setLoading(true);
    axios
      .get(`/admin?${queryString}`)
      .then(({ data }) => {
        pagination.setTotalCount(data.totalCount);
        pagination.setItems(data.items);
        pagination.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        pagination.setLoading(false);
      });
  }, [filter.form.orderBy, filter.form.sort]);

  return (
    <Page className={classes.root} title="방침 게시 관리">
      <Container maxWidth={false}>
        <Typography variant="h3" color="textPrimary">
          방침 게시 관리
        </Typography>
        <PolicyContainers.Filter pagination={pagination} filter={filter} />
        <Box mt={3}>
          <Box className={classes.buttons} pt={1}>
            <Button variant="outlined" color="primary">
              엑셀 다운로드
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => history.push('/policy/register')}
            >
              신규등록
            </Button>
          </Box>
          <PolicyContainers.Table pagination={pagination} filter={filter} />
        </Box>
      </Container>
    </Page>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
}));

export default List;
