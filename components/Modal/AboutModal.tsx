import * as React from 'react';
import clsx from 'clsx';

import styles from './Modal.module.css';

export function AboutModal() {
  return (
    <section
      className={clsx(styles.modal)}
      tabIndex={-1}
      style={{ zIndex: 40 }}
    >
      <div className="bg-white p-8">
        <h1 className="uppercase underline">E-Drums (Alpha)</h1>
        <p>
          A simple{' '}
          <a
            href="https://en.wikipedia.org/wiki/Euclidean_rhythm"
            rel="nofollow noreferrer"
            target="_blank"
          >
            Euclidean rhythm
          </a>{' '}
          generator. More stuff coming soon.
        </p>

        <p>
          Made by{' '}
          <a
            className="underline"
            href="https://jamespants.com/"
            rel="noopener nofollow noreferrer"
            target="_blank"
          >
            James Pants
          </a>
          <br />
          <br />
          <a
            className="underline"
            href="https://twitter.com/sirjamespants"
            rel="noopener nofollow noreferrer"
            target="_blank"
          >
            Twitter
          </a>
        </p>
      </div>
    </section>
  );
}
