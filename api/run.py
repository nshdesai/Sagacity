#! /usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Copyright © 2019 nishkrit <nishkrit@bionicdell>
#
# Distributed under terms of the MIT license.

"""
A simple script to test the NLP network
"""
import json
import os
import tensorflow as tf
import numpy as np

import model, sample, encoder


def load_ai(
    model_name='774M',
    seed=None,
    nsamples=1,
    batch_size=None,
    length=None,
    temperature=1,
    top_k=0
):
    if batch_size is None:
        batch_size = 1
    assert nsamples % batch_size == 0
    np.random.seed(seed)
    tf.set_random_seed(seed)

    enc = encoder.get_encoder(model_name)
    hparams = model.default_hparams()
    with open(os.path.join('models', model_name, 'hparams.json')) as f:
        hparams.override_from_dict(json.load(f))

    return enc, nsamples, batch_size, hparams, temperature, top_k, model_name


def run_ai(
    enc=None,
    nsamples=1,
    batch_size=None,
    hparams=None,
    temperature=1,
    top_k=0,
    model_name='774M',
    input_text=None
):
    if enc is None or input_text is None or hparams is None or model_name is None:
        return None

    context_tokens = enc.encode(input_text)
    generated = 0
    ret = ""
    length = hparams.n_ctx // 2
    with tf.Session(graph=tf.Graph()) as sess:
        context = tf.placeholder(tf.int32, [batch_size, None])
        output = sample.sample_sequence(
            hparams=hparams, length=length,
            context=context,
            batch_size=batch_size,
            temperature=temperature, top_k=top_k
        )

        saver = tf.train.Saver()
        ckpt = tf.train.latest_checkpoint(os.path.join('models', model_name))
        saver.restore(sess, ckpt)
        for _ in range(nsamples // batch_size):
            out = sess.run(output, feed_dict={
                context: [context_tokens for _ in range(batch_size)]
            })[:, len(context_tokens):]
            for i in range(batch_size):
                generated += 1
                ret += enc.decode(out[i])
    return ret

def print_prompt(prompt):
    print ("*"*80)
    print ('*' + ' '*3 + prompt)
    print ("*"*80)

def main():
    while True:
        text = input('Enter a text prompt: ')
        print_prompt('GENERATING TEXT FOR: ' + text)
        enc, nsamples, batch_size, hparams, temperature, top_k, model_name = load_ai()

        out = run_ai(enc, nsamples, batch_size, hparams, temperature, top_k, model_name, text)
        print_prompt("GENERATED TEXT: ")
        print(out[0:1500])
        print_prompt("END OF GENERATED TEXT")

if __name__=="__main__":
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
    main()
