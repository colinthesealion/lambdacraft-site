import React from 'react';
import {
  RecoilRoot
} from 'recoil';
import {
  Breadcrumbs,
  CircularProgress,
  Link
} from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Maps from '../Maps';
import MembersPage from '../Members';
import Scoreboard from '../Scoreboard';

function HomePage() {
  return (
    <div>LambaCraft is a Minecraft SMP server started in 2019 by LambdaCube, DoctorNoi and Ninjavitis</div>
  );
}

function ScoreboardPage() {
  return (
    <React.Suspense fallback={<CircularProgress />}>
      <Scoreboard />
    </React.Suspense>
  );
}

function MapsPage() {
  return (
    <React.Suspense fallback={<CircularProgress />}>
      <Maps />
    </React.Suspense>
  );
}

interface AppProps {
}
export default function App(_props: AppProps) {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Breadcrumbs>
          <Link href="/">Home</Link>
          <Link href="/scoreboard">Scoreboard</Link>
          <Link href="/members">Members</Link>
          <Link href="/maps">Maps</Link>
        </Breadcrumbs>
        <Switch>
          <Route exact path="/"><HomePage /></Route>
          <Route exact path="/scoreboard"><ScoreboardPage /></Route>
          <Route exact path="/members"><MembersPage /></Route>
          <Route exact path="/maps"><MapsPage /></Route>
        </Switch>
      </BrowserRouter>
    </RecoilRoot>
  );
}
