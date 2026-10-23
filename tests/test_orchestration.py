import unittest
from agent_demo.orchestration import SupervisorState, parse_decision


def ready_for_developers(**kwargs):
    s = SupervisorState(**kwargs)
    s.mark_finished('Architect', feasible=True)
    s.mark_finished('QA')  # tests written
    return s


class SupervisorTests(unittest.TestCase):
    def test_test_first_happy_path(self):
        s = SupervisorState()
        self.assertEqual(s.allowed(), ['Architect'])
        s.validate({'assign': 'Architect'})
        s.mark_finished('Architect', feasible=True)
        self.assertEqual(s.allowed(), ['QA'])
        self.assertEqual(s.phase, 'write_tests')
        s.mark_finished('QA')
        self.assertEqual(set(s.allowed()), {'Backend', 'Frontend'})
        s.mark_finished('Backend'); s.mark_finished('Frontend')
        self.assertEqual(s.allowed(), ['QA'])
        self.assertEqual(s.phase, 'run_tests')
        s.mark_finished('QA', qa_passed=True)
        self.assertEqual(s.allowed(), ['COMPLETE'])
        s.close('COMPLETE')
        self.assertEqual(s.allowed(), [])

    def test_developers_cannot_start_before_tests_exist(self):
        s = SupervisorState(); s.mark_finished('Architect', feasible=True)
        with self.assertRaises(ValueError): s.validate({'assign': 'Backend'})

    def test_infeasible_request_can_only_stop(self):
        s = SupervisorState(); s.mark_finished('Architect', feasible=False)
        self.assertEqual(s.allowed(), ['STOP'])
        with self.assertRaises(ValueError): s.validate({'assign': 'QA'})

    def test_frontend_before_backend(self):
        s = ready_for_developers(); s.mark_finished('Frontend')
        self.assertEqual(s.allowed(), ['Backend'])
        s.mark_finished('Backend'); self.assertEqual(s.allowed(), ['QA'])

    def test_one_bounded_rework(self):
        s = ready_for_developers()
        s.mark_finished('Backend'); s.mark_finished('Frontend')
        s.mark_finished('QA', qa_passed=False)
        self.assertEqual(set(s.allowed()), {'Backend', 'Frontend', 'STOP'})
        s.mark_finished('Backend')
        self.assertEqual(s.allowed(), ['QA'])
        s.mark_finished('QA', qa_passed=False)
        self.assertEqual(s.allowed(), ['STOP'])
        s.close('STOP')

    def test_no_corrections_stops_after_failed_qa(self):
        s = ready_for_developers(max_corrections=0)
        s.mark_finished('Backend'); s.mark_finished('Frontend')
        s.mark_finished('QA', qa_passed=False)
        self.assertEqual(s.allowed(), ['STOP'])
        with self.assertRaises(ValueError): s.validate({'assign': 'Backend'})

    def test_out_of_order_is_rejected(self):
        s = SupervisorState()
        with self.assertRaises(ValueError): s.validate({'assign': 'Backend'})
        with self.assertRaises(ValueError): s.close('COMPLETE')

    def test_manager_json_contract(self):
        d = parse_decision('```json\n{"assign":"QA","reason":"Tests pending."}\n```')
        self.assertEqual(d['assign'], 'QA')
        for bad in ('not json', '{"assign":"Backend"}', '["Backend"]'):
            with self.assertRaises((ValueError, TypeError)): parse_decision(bad)


if __name__ == '__main__': unittest.main()
